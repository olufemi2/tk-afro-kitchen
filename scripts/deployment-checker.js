#!/usr/bin/env node

/**
 * Deployment Status Checker
 * Monitors DNS propagation and SSL certificate status
 */

const https = require('https');
const dns = require('dns').promises;

const domains = [
  'staging.tkafrokitchen.com',
  'tkafrokitchen.com', 
  'www.tkafrokitchen.com'
];

class DeploymentChecker {
  async checkDNS(domain) {
    try {
      console.log(`🔍 Checking DNS for ${domain}...`);
      
      // Check A records
      try {
        const addresses = await dns.resolve4(domain);
        console.log(`   A records: ${addresses.join(', ')}`);
        
        // Check if pointing to Vercel
        const vercelIP = '76.76.19.61';
        if (addresses.includes(vercelIP)) {
          console.log(`   ✅ ${domain} correctly points to Vercel`);
          return { domain, status: 'correct', type: 'A', values: addresses };
        } else {
          console.log(`   ⚠️  ${domain} not pointing to Vercel IP`);
          return { domain, status: 'incorrect', type: 'A', values: addresses };
        }
      } catch (error) {
        // Try CNAME if A record fails
        try {
          const cnames = await dns.resolveCname(domain);
          console.log(`   CNAME records: ${cnames.join(', ')}`);
          
          // Check if pointing to Vercel
          const pointsToVercel = cnames.some(cname => 
            cname.includes('vercel.app') || cname.includes('vercel.com')
          );
          
          if (pointsToVercel) {
            console.log(`   ✅ ${domain} correctly points to Vercel via CNAME`);
            return { domain, status: 'correct', type: 'CNAME', values: cnames };
          } else {
            console.log(`   ⚠️  ${domain} CNAME doesn't point to Vercel`);
            return { domain, status: 'incorrect', type: 'CNAME', values: cnames };
          }
        } catch (cnameError) {
          console.log(`   ❌ No A or CNAME records found for ${domain}`);
          return { domain, status: 'missing', type: 'none', values: [] };
        }
      }
    } catch (error) {
      console.log(`   ❌ DNS lookup failed: ${error.message}`);
      return { domain, status: 'error', error: error.message };
    }
  }

  async checkSSL(domain) {
    return new Promise((resolve) => {
      console.log(`🔒 Checking SSL for ${domain}...`);
      
      const options = {
        hostname: domain,
        port: 443,
        method: 'HEAD',
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        const cert = res.socket.getPeerCertificate();
        if (cert && cert.subject) {
          console.log(`   ✅ SSL certificate valid`);
          console.log(`   📅 Expires: ${cert.valid_to}`);
          console.log(`   🏢 Issuer: ${cert.issuer.O}`);
          resolve({ domain, status: 'valid', cert: cert });
        } else {
          console.log(`   ❌ No SSL certificate found`);
          resolve({ domain, status: 'missing' });
        }
      });

      req.on('error', (error) => {
        console.log(`   ❌ SSL check failed: ${error.message}`);
        resolve({ domain, status: 'error', error: error.message });
      });

      req.on('timeout', () => {
        console.log(`   ⏰ SSL check timed out`);
        resolve({ domain, status: 'timeout' });
      });

      req.end();
    });
  }

  async checkWebsite(domain) {
    return new Promise((resolve) => {
      console.log(`🌐 Checking website for ${domain}...`);
      
      const options = {
        hostname: domain,
        port: 443,
        path: '/',
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'TK-Afro-Kitchen-Deployment-Checker'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const isNextJS = data.includes('__NEXT_DATA__') || data.includes('_app');
            const isTKAfro = data.includes('TK Afro Kitchen') || data.includes('Nigerian Cuisine');
            
            console.log(`   ✅ Website responding (${res.statusCode})`);
            console.log(`   🔧 Next.js detected: ${isNextJS ? 'Yes' : 'No'}`);
            console.log(`   🍴 TK Afro content: ${isTKAfro ? 'Yes' : 'No'}`);
            
            resolve({ 
              domain, 
              status: 'online', 
              statusCode: res.statusCode,
              isNextJS,
              isTKAfro 
            });
          } else {
            console.log(`   ⚠️  Website returned ${res.statusCode}`);
            resolve({ 
              domain, 
              status: 'error', 
              statusCode: res.statusCode 
            });
          }
        });
      });

      req.on('error', (error) => {
        console.log(`   ❌ Website check failed: ${error.message}`);
        resolve({ domain, status: 'offline', error: error.message });
      });

      req.on('timeout', () => {
        console.log(`   ⏰ Website check timed out`);
        resolve({ domain, status: 'timeout' });
      });

      req.end();
    });
  }

  async checkAll() {
    console.log('🚀 TK Afro Kitchen - Deployment Status Check');
    console.log('=============================================\n');

    const results = {
      dns: [],
      ssl: [],
      websites: []
    };

    // Check DNS for all domains
    console.log('📡 DNS Status Check');
    console.log('==================');
    for (const domain of domains) {
      const dnsResult = await this.checkDNS(domain);
      results.dns.push(dnsResult);
      console.log('');
    }

    // Check SSL for all domains  
    console.log('🔒 SSL Certificate Check');
    console.log('=======================');
    for (const domain of domains) {
      const sslResult = await this.checkSSL(domain);
      results.ssl.push(sslResult);
      console.log('');
    }

    // Check websites
    console.log('🌐 Website Status Check');
    console.log('======================');
    for (const domain of domains) {
      const websiteResult = await this.checkWebsite(domain);
      results.websites.push(websiteResult);
      console.log('');
    }

    // Summary
    this.printSummary(results);
    return results;
  }

  printSummary(results) {
    console.log('📊 DEPLOYMENT SUMMARY');
    console.log('====================');

    // DNS Summary
    const dnsCorrect = results.dns.filter(r => r.status === 'correct').length;
    const dnsTotal = results.dns.length;
    console.log(`📡 DNS Status: ${dnsCorrect}/${dnsTotal} domains configured correctly`);

    // SSL Summary
    const sslValid = results.ssl.filter(r => r.status === 'valid').length;
    const sslTotal = results.ssl.length;
    console.log(`🔒 SSL Status: ${sslValid}/${sslTotal} certificates valid`);

    // Website Summary
    const websitesOnline = results.websites.filter(r => r.status === 'online').length;
    const websitesTotal = results.websites.length;
    console.log(`🌐 Website Status: ${websitesOnline}/${websitesTotal} sites online`);

    console.log('');

    // Overall Status
    if (dnsCorrect === dnsTotal && sslValid === sslTotal && websitesOnline === websitesTotal) {
      console.log('🎉 ALL SYSTEMS OPERATIONAL!');
      console.log('   Your deployment is fully functional.');
    } else {
      console.log('⚠️  ISSUES DETECTED');
      console.log('   Some components need attention:');
      
      if (dnsCorrect < dnsTotal) {
        console.log('   • DNS records may need more time to propagate');
        console.log('   • Check your DNS automation settings');
      }
      
      if (sslValid < sslTotal) {
        console.log('   • SSL certificates may still be provisioning');
        console.log('   • This usually resolves within 10-30 minutes');
      }
      
      if (websitesOnline < websitesTotal) {
        console.log('   • Some websites are not responding');
        console.log('   • Check Vercel deployment status');
      }
    }

    console.log('');
    console.log('💡 Troubleshooting Tips:');
    console.log('   • DNS changes can take 5-15 minutes to propagate globally');
    console.log('   • SSL certificates are automatically provisioned by Vercel');
    console.log('   • Try clearing your browser cache if issues persist');
    console.log('   • Use incognito/private browsing to avoid cache issues');
  }
}

// CLI interface
if (require.main === module) {
  const checker = new DeploymentChecker();
  checker.checkAll().catch(console.error);
}

module.exports = DeploymentChecker;