#!/usr/bin/env node

/**
 * Local Functionality Testing Script
 * Tests all application functionalities on localhost:3000
 */

const http = require('http');
const https = require('https');

class LocalFunctionalityTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
  }

  async testAllFunctionalities() {
    console.log('🧪 TK Afro Kitchen - Local Functionality Tests');
    console.log('===============================================\n');

    const tests = [
      { name: 'Homepage Load', test: () => this.testPageLoad('/') },
      { name: 'Menu Page Load', test: () => this.testPageLoad('/menu') },
      { name: 'Checkout Page Load', test: () => this.testPageLoad('/checkout') },
      { name: 'About Page Load', test: () => this.testPageLoad('/about') },
      { name: 'Contact Page Load', test: () => this.testPageLoad('/contact') },
      { name: 'API Quote Endpoint', test: () => this.testAPIEndpoint('/api/quote') },
      { name: 'API PayPal Webhook', test: () => this.testAPIEndpoint('/api/webhooks/paypal') },
      { name: 'Static Assets', test: () => this.testStaticAssets() },
      { name: 'Environment Variables', test: () => this.testEnvironmentVariables() },
      { name: 'Build Output', test: () => this.testBuildOutput() }
    ];

    for (const test of tests) {
      try {
        console.log(`🔍 Testing: ${test.name}`);
        const result = await test.test();
        this.testResults.push({ name: test.name, status: 'PASS', result });
        console.log(`✅ ${test.name}: PASSED`);
        if (result.details) {
          console.log(`   ${result.details}`);
        }
        console.log('');
      } catch (error) {
        this.testResults.push({ name: test.name, status: 'FAIL', error: error.message });
        console.log(`❌ ${test.name}: FAILED - ${error.message}\n`);
      }
    }

    this.generateReport();
  }

  async testPageLoad(path) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const url = `${this.baseUrl}${path}`;
      
      http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const loadTime = Date.now() - startTime;
          
          if (res.statusCode === 200) {
            const hasReactContent = data.includes('__NEXT_DATA__') || data.includes('_app');
            const hasTitle = data.includes('<title>');
            const hasMeta = data.includes('<meta');
            
            resolve({
              statusCode: res.statusCode,
              loadTime: `${loadTime}ms`,
              hasReactContent,
              hasTitle,
              hasMeta,
              contentLength: data.length,
              details: `Loaded in ${loadTime}ms, ${data.length} bytes`
            });
          } else {
            reject(new Error(`Page returned ${res.statusCode}`));
          }
        });
      }).on('error', reject);
    });
  }

  async testAPIEndpoint(path) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({ test: 'functionality_test' });
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // API endpoints should respond (even if with errors for unauthorized requests)
          if (res.statusCode >= 200 && res.statusCode < 500) {
            resolve({
              statusCode: res.statusCode,
              responseLength: data.length,
              details: `API endpoint responding with ${res.statusCode}`
            });
          } else {
            reject(new Error(`API endpoint returned ${res.statusCode}`));
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  async testStaticAssets() {
    const assets = [
      '/images/brand/tklogo.jpg',
      '/images/dishes/Jollof.jpeg',
      '/next.svg',
      '/vercel.svg'
    ];

    const results = [];
    
    for (const asset of assets) {
      try {
        const result = await this.testAssetLoad(asset);
        results.push({ asset, status: 'PASS', size: result.size });
      } catch (error) {
        results.push({ asset, status: 'FAIL', error: error.message });
      }
    }

    const passedAssets = results.filter(r => r.status === 'PASS').length;
    const totalAssets = results.length;

    if (passedAssets === totalAssets) {
      return {
        allAssetsLoaded: true,
        passedAssets,
        totalAssets,
        details: `${passedAssets}/${totalAssets} static assets loaded successfully`
      };
    } else {
      throw new Error(`Only ${passedAssets}/${totalAssets} static assets loaded`);
    }
  }

  async testAssetLoad(assetPath) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${assetPath}`;
      
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          let size = 0;
          res.on('data', chunk => size += chunk.length);
          res.on('end', () => {
            resolve({ statusCode: res.statusCode, size });
          });
        } else {
          reject(new Error(`Asset returned ${res.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  async testEnvironmentVariables() {
    const requiredVars = {
      'NEXT_PUBLIC_PAYPAL_CLIENT_ID': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      'IONOS_API_KEY': process.env.IONOS_API_KEY,
      'VERCEL_TOKEN': process.env.VERCEL_TOKEN
    };

    const results = Object.entries(requiredVars).map(([key, value]) => ({
      variable: key,
      present: !!value,
      length: value ? value.length : 0,
      masked: value ? `${value.substring(0, 8)}...` : 'NOT SET'
    }));

    const allPresent = results.every(r => r.present);
    
    if (allPresent) {
      return {
        allVariablesPresent: true,
        variables: results,
        details: `All ${results.length} environment variables configured`
      };
    } else {
      const missing = results.filter(r => !r.present).map(r => r.variable);
      throw new Error(`Missing variables: ${missing.join(', ')}`);
    }
  }

  async testBuildOutput() {
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Check if .next directory exists
      const nextDir = path.join(process.cwd(), '.next');
      const buildExists = fs.existsSync(nextDir);
      
      if (!buildExists) {
        throw new Error('.next build directory not found');
      }

      // Check for key build files
      const buildFiles = [
        '.next/BUILD_ID',
        '.next/static',
        '.next/server',
        '.next/cache'
      ];

      const fileChecks = buildFiles.map(file => {
        const fullPath = path.join(process.cwd(), file);
        return {
          file,
          exists: fs.existsSync(fullPath)
        };
      });

      const allFilesExist = fileChecks.every(check => check.exists);
      
      if (allFilesExist) {
        return {
          buildComplete: true,
          buildFiles: fileChecks,
          details: 'Build artifacts present and valid'
        };
      } else {
        const missing = fileChecks.filter(c => !c.exists).map(c => c.file);
        throw new Error(`Missing build files: ${missing.join(', ')}`);
      }
    } catch (error) {
      throw new Error(`Build check failed: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n📊 LOCAL FUNCTIONALITY TEST REPORT');
    console.log('==================================');

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;
    const successRate = Math.round(passed/total * 100);

    console.log(`\n📈 Overall Score: ${passed}/${total} tests passed (${successRate}%)`);

    if (failed === 0) {
      console.log('🎉 ALL FUNCTIONALITY TESTS PASSED!');
      console.log('✅ Application is ready for deployment');
    } else {
      console.log(`⚠️  ${failed} test(s) failed. Review before deployment.`);
    }

    console.log('\n📋 Test Details:');
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.status}`);
      if (result.status === 'FAIL') {
        console.log(`   Error: ${result.error}`);
      }
    });

    // Feature-specific analysis
    console.log('\n🔍 FEATURE ANALYSIS:');
    
    const pageTests = this.testResults.filter(r => r.name.includes('Page Load'));
    const apiTests = this.testResults.filter(r => r.name.includes('API'));
    const envTest = this.testResults.find(r => r.name === 'Environment Variables');
    const buildTest = this.testResults.find(r => r.name === 'Build Output');

    console.log(`📄 Pages: ${pageTests.filter(t => t.status === 'PASS').length}/${pageTests.length} loading correctly`);
    console.log(`🔌 APIs: ${apiTests.filter(t => t.status === 'PASS').length}/${apiTests.length} endpoints responding`);
    console.log(`⚙️  Environment: ${envTest?.status === 'PASS' ? 'Configured' : 'Issues detected'}`);
    console.log(`🏗️  Build: ${buildTest?.status === 'PASS' ? 'Complete' : 'Issues detected'}`);

    console.log('\n💡 DEPLOYMENT READINESS:');
    if (successRate >= 90) {
      console.log('🟢 READY - Application passed most functionality tests');
      console.log('🚀 Safe to deploy to staging for final testing');
    } else if (successRate >= 70) {
      console.log('🟡 CAUTION - Some functionality issues detected');
      console.log('🔧 Review failed tests before deployment');
    } else {
      console.log('🔴 NOT READY - Multiple functionality issues');
      console.log('🛠️  Fix critical issues before deployment');
    }

    console.log('\n🔄 Next Steps:');
    console.log('1. Review any failed tests above');
    console.log('2. Test checkout flow manually in browser');
    console.log('3. Verify payment integration with PayPal sandbox');
    console.log('4. Deploy to staging environment');
    console.log('5. Perform end-to-end testing');
  }
}

// CLI interface
if (require.main === module) {
  const tester = new LocalFunctionalityTester();
  tester.testAllFunctionalities().catch(console.error);
}

module.exports = LocalFunctionalityTester;