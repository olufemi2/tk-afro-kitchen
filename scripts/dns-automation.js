#!/usr/bin/env node

/**
 * Automated DNS Management Script
 * Handles IONOS DNS updates and Vercel domain configuration
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

// Load environment variables at startup
loadEnvFile();

// Configuration
const config = {
  ionos: {
    apiKey: process.env.IONOS_API_KEY,
    apiSecret: process.env.IONOS_API_SECRET,
    baseUrl: 'https://api.hosting.ionos.com',
    domain: 'tkafrokitchen.com'
  },
  vercel: {
    token: process.env.VERCEL_TOKEN,
    baseUrl: 'https://api.vercel.com',
    projectId: process.env.VERCEL_PROJECT_ID,
    stagingUrl: 'staging-tkafrokitchen.vercel.app',
    productionUrl: process.env.VERCEL_PRODUCTION_URL || 'tkafro-main.vercel.app'
  }
};

// API Helper Functions
class APIClient {
  static async request(url, options = {}) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve({ status: res.statusCode, data: result });
          } catch (e) {
            resolve({ status: res.statusCode, data: data });
          }
        });
      });
      
      req.on('error', reject);
      if (options.body) req.write(options.body);
      req.end();
    });
  }
}

// IONOS DNS Management
class IONOSDNSManager {
  constructor() {
    this.auth = Buffer.from(`${config.ionos.apiKey}:${config.ionos.apiSecret}`).toString('base64');
  }

  async getZones() {
    console.log('🔍 Fetching DNS zones from IONOS...');
    const response = await APIClient.request(`${config.ionos.baseUrl}/v1/zones`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Successfully fetched zones');
      return response.data;
    } else {
      throw new Error(`Failed to fetch zones: ${response.status}`);
    }
  }

  async getRecords(zoneId) {
    console.log(`🔍 Fetching DNS records for zone ${zoneId}...`);
    const response = await APIClient.request(`${config.ionos.baseUrl}/v1/zones/${zoneId}/records`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Successfully fetched records');
      return response.data;
    } else {
      throw new Error(`Failed to fetch records: ${response.status}`);
    }
  }

  async deleteRecord(zoneId, recordId) {
    console.log(`🗑️  Deleting DNS record ${recordId}...`);
    const response = await APIClient.request(`${config.ionos.baseUrl}/v1/zones/${zoneId}/records/${recordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Successfully deleted record');
      return true;
    } else {
      throw new Error(`Failed to delete record: ${response.status}`);
    }
  }

  async createRecord(zoneId, record) {
    console.log(`➕ Creating DNS record: ${record.name} → ${record.content}`);
    const response = await APIClient.request(`${config.ionos.baseUrl}/v1/zones/${zoneId}/records`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    });
    
    if (response.status === 201) {
      console.log('✅ Successfully created record');
      return response.data;
    } else {
      throw new Error(`Failed to create record: ${response.status} - ${JSON.stringify(response.data)}`);
    }
  }

  async updateStagingDNS() {
    try {
      const zones = await this.getZones();
      const zone = zones.find(z => z.name === config.ionos.domain);
      
      if (!zone) {
        throw new Error(`Zone ${config.ionos.domain} not found`);
      }

      const records = await this.getRecords(zone.id);
      
      // Find and delete existing staging A record
      const stagingARecord = records.find(r => 
        r.name === 'staging' && r.type === 'A'
      );
      
      if (stagingARecord) {
        await this.deleteRecord(zone.id, stagingARecord.id);
      }

      // Create new staging CNAME record
      await this.createRecord(zone.id, {
        name: 'staging',
        type: 'CNAME',
        content: config.vercel.stagingUrl,
        ttl: 300
      });

      console.log('🎉 Staging DNS updated successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error updating staging DNS:', error.message);
      throw error;
    }
  }

  async updateProductionDNS() {
    try {
      const zones = await this.getZones();
      const zone = zones.find(z => z.name === config.ionos.domain);
      
      if (!zone) {
        throw new Error(`Zone ${config.ionos.domain} not found`);
      }

      const records = await this.getRecords(zone.id);
      
      // Update root domain A record
      const rootARecord = records.find(r => 
        r.name === '@' && r.type === 'A'
      );
      
      if (rootARecord) {
        await this.deleteRecord(zone.id, rootARecord.id);
      }

      await this.createRecord(zone.id, {
        name: '@',
        type: 'A',
        content: '76.76.19.61', // Vercel IP
        ttl: 300
      });

      // Update www subdomain
      const wwwRecord = records.find(r => 
        r.name === 'www' && (r.type === 'A' || r.type === 'CNAME')
      );
      
      if (wwwRecord) {
        await this.deleteRecord(zone.id, wwwRecord.id);
      }

      await this.createRecord(zone.id, {
        name: 'www',
        type: 'CNAME',
        content: config.ionos.domain,
        ttl: 300
      });

      console.log('🎉 Production DNS updated successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error updating production DNS:', error.message);
      throw error;
    }
  }
}

// Vercel Domain Management
class VercelDomainManager {
  constructor() {
    this.headers = {
      'Authorization': `Bearer ${config.vercel.token}`,
      'Content-Type': 'application/json'
    };
  }

  async addDomain(domain) {
    console.log(`➕ Adding domain ${domain} to Vercel project...`);
    
    const response = await APIClient.request(
      `${config.vercel.baseUrl}/v9/projects/${config.vercel.projectId}/domains`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ name: domain })
      }
    );
    
    if (response.status === 200 || response.status === 201) {
      console.log(`✅ Successfully added domain ${domain}`);
      return response.data;
    } else if ((response.status === 400 && response.data.error?.code === 'domain_already_exists') || 
               (response.status === 409 && response.data.error?.code === 'domain_already_in_use')) {
      console.log(`ℹ️  Domain ${domain} already exists and is verified`);
      return { name: domain, verified: true };
    } else {
      throw new Error(`Failed to add domain ${domain}: ${response.status} - ${JSON.stringify(response.data)}`);
    }
  }

  async addAllDomains() {
    const domains = [
      'staging.tkafrokitchen.com',
      'tkafrokitchen.com',
      'www.tkafrokitchen.com'
    ];

    for (const domain of domains) {
      try {
        await this.addDomain(domain);
      } catch (error) {
        console.error(`Failed to add domain ${domain}:`, error.message);
      }
    }
  }
}

// Main automation function
async function automateDeployment(environment = 'staging') {
  console.log(`🚀 Starting automated deployment for ${environment}...`);
  
  // Validate environment variables
  const requiredEnvVars = [
    'IONOS_API_KEY',
    'IONOS_API_SECRET', 
    'VERCEL_TOKEN',
    'VERCEL_PROJECT_ID'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  try {
    const ionosManager = new IONOSDNSManager();
    const vercelManager = new VercelDomainManager();

    // Step 1: Add domains to Vercel
    console.log('\n📋 Step 1: Adding domains to Vercel...');
    await vercelManager.addAllDomains();

    // Step 2: Deploy to Vercel
    console.log('\n📋 Step 2: Deploying to Vercel...');
    if (environment === 'staging') {
      execSync('vercel --prod --token=' + config.vercel.token, { stdio: 'inherit' });
    } else {
      execSync('vercel --prod --token=' + config.vercel.token, { stdio: 'inherit' });
    }

    // Step 3: Update DNS
    console.log('\n📋 Step 3: Updating DNS records...');
    if (environment === 'staging') {
      await ionosManager.updateStagingDNS();
    } else {
      await ionosManager.updateStagingDNS();
      await ionosManager.updateProductionDNS();
    }

    console.log('\n🎉 Automated deployment completed successfully!');
    console.log(`\n📝 Next steps:`);
    console.log(`   • Wait 5-15 minutes for DNS propagation`);
    console.log(`   • Test ${environment === 'staging' ? 'staging.tkafrokitchen.com' : 'tkafrokitchen.com'}`);
    console.log(`   • SSL certificates will be provisioned automatically`);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const environment = process.argv[2] || 'staging';
  automateDeployment(environment);
}

module.exports = { automateDeployment, IONOSDNSManager, VercelDomainManager };