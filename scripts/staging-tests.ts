#!/usr/bin/env ts-node

/**
 * TK Afro Kitchen - Staging Environment Verification Tests
 * Run this script to verify staging deployment is working correctly
 */

import { promises as fs } from 'fs';
import path from 'path';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: string;
}

class StagingTests {
  private results: TestResult[] = [];
  private baseUrl: string;

  constructor(baseUrl = 'https://staging.tkafrokitchen.com') {
    this.baseUrl = baseUrl;
  }

  private addResult(name: string, status: 'PASS' | 'FAIL' | 'WARN', message: string, details?: string) {
    this.results.push({ name, status, message, details });
  }

  // Test 1: Environment Variables Check
  async testEnvironmentVariables() {
    console.log('🔍 Testing Environment Variables...');
    
    try {
      const requiredVars = [
        'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
        'PAYPAL_ACCESS_TOKEN', 
        'PAYPAL_WEBHOOK_ID'
      ];

      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length === 0) {
        this.addResult('Environment Variables', 'PASS', 'All required variables are set');
      } else {
        this.addResult('Environment Variables', 'FAIL', 
          `Missing variables: ${missingVars.join(', ')}`,
          'Check .env.staging file and Vercel environment settings'
        );
      }
    } catch (error) {
      this.addResult('Environment Variables', 'FAIL', 'Error checking environment variables');
    }
  }

  // Test 2: Build Output Verification
  async testBuildOutput() {
    console.log('🏗️ Testing Build Output...');
    
    try {
      const buildDir = path.join(process.cwd(), '.next');
      const buildExists = await fs.access(buildDir).then(() => true).catch(() => false);
      
      if (buildExists) {
        // Check for key build artifacts
        const serverDir = path.join(buildDir, 'server');
        const staticDir = path.join(buildDir, 'static');
        
        const serverExists = await fs.access(serverDir).then(() => true).catch(() => false);
        const staticExists = await fs.access(staticDir).then(() => true).catch(() => false);
        
        if (serverExists && staticExists) {
          this.addResult('Build Output', 'PASS', 'Build artifacts present and valid');
        } else {
          this.addResult('Build Output', 'WARN', 'Build exists but missing some artifacts');
        }
      } else {
        this.addResult('Build Output', 'FAIL', 'No build output found - run npm run build first');
      }
    } catch (error) {
      this.addResult('Build Output', 'FAIL', 'Error checking build output');
    }
  }

  // Test 3: Critical Routes Check
  async testCriticalRoutes() {
    console.log('🛣️ Testing Critical Routes...');
    
    const routes = [
      '/',
      '/menu',
      '/about',
      '/contact',
      '/checkout',
      '/catering',
      '/frozen',
      '/api/quote',
      '/api/webhooks/paypal'
    ];

    for (const route of routes) {
      try {
        const response = await fetch(`${this.baseUrl}${route}`, {
          method: route.startsWith('/api/') ? 'POST' : 'GET',
          headers: { 'User-Agent': 'TK-Afro-Staging-Test' }
        });

        if (response.status < 400) {
          this.addResult(`Route ${route}`, 'PASS', `Status: ${response.status}`);
        } else if (response.status === 405 && route.startsWith('/api/')) {
          // API routes might reject GET requests - this is OK
          this.addResult(`Route ${route}`, 'PASS', 'API endpoint accessible (405 expected for GET)');
        } else {
          this.addResult(`Route ${route}`, 'FAIL', `Status: ${response.status}`);
        }
      } catch (error) {
        this.addResult(`Route ${route}`, 'FAIL', 'Network error or route not accessible');
      }
    }
  }

  // Test 4: PayPal Integration Check
  async testPayPalIntegration() {
    console.log('💳 Testing PayPal Integration...');
    
    try {
      // Test PayPal SDK loading
      const checkoutResponse = await fetch(`${this.baseUrl}/checkout`);
      const checkoutHtml = await checkoutResponse.text();
      
      if (checkoutHtml.includes('paypal')) {
        this.addResult('PayPal Integration', 'PASS', 'PayPal SDK references found on checkout page');
      } else {
        this.addResult('PayPal Integration', 'WARN', 'PayPal references not found in checkout page');
      }

      // Test webhook endpoint
      const webhookResponse = await fetch(`${this.baseUrl}/api/webhooks/paypal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'staging' })
      });

      if (webhookResponse.status === 401) {
        // Expected - webhook should reject unauthorized requests
        this.addResult('PayPal Webhook', 'PASS', 'Webhook endpoint properly secured');
      } else {
        this.addResult('PayPal Webhook', 'WARN', `Unexpected webhook response: ${webhookResponse.status}`);
      }
    } catch (error) {
      this.addResult('PayPal Integration', 'FAIL', 'Error testing PayPal integration');
    }
  }

  // Test 5: Performance Check
  async testPerformance() {
    console.log('⚡ Testing Performance...');
    
    try {
      const start = Date.now();
      const response = await fetch(this.baseUrl);
      const duration = Date.now() - start;
      
      if (duration < 2000) {
        this.addResult('Performance', 'PASS', `Homepage loaded in ${duration}ms`);
      } else if (duration < 5000) {
        this.addResult('Performance', 'WARN', `Homepage loaded in ${duration}ms (consider optimization)`);
      } else {
        this.addResult('Performance', 'FAIL', `Homepage loaded in ${duration}ms (too slow)`);
      }
    } catch (error) {
      this.addResult('Performance', 'FAIL', 'Error testing performance');
    }
  }

  // Test 6: Security Headers Check
  async testSecurityHeaders() {
    console.log('🔒 Testing Security Headers...');
    
    try {
      const response = await fetch(this.baseUrl);
      const headers = response.headers;
      
      const requiredHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection'
      ];

      const missingHeaders = requiredHeaders.filter(header => !headers.get(header));
      
      if (missingHeaders.length === 0) {
        this.addResult('Security Headers', 'PASS', 'All required security headers present');
      } else {
        this.addResult('Security Headers', 'WARN', 
          `Missing headers: ${missingHeaders.join(', ')}`);
      }

      // Check for staging-specific no-index header
      if (headers.get('x-robots-tag')?.includes('noindex')) {
        this.addResult('SEO Protection', 'PASS', 'Staging site properly protected from indexing');
      } else {
        this.addResult('SEO Protection', 'WARN', 'Staging site not protected from search indexing');
      }
    } catch (error) {
      this.addResult('Security Headers', 'FAIL', 'Error checking security headers');
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting TK Afro Kitchen Staging Tests...\n');
    console.log(`Testing against: ${this.baseUrl}\n`);

    await this.testEnvironmentVariables();
    await this.testBuildOutput();
    await this.testCriticalRoutes();
    await this.testPayPalIntegration();
    await this.testPerformance();
    await this.testSecurityHeaders();

    this.printResults();
  }

  // Print test results
  private printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================\n');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const warned = this.results.filter(r => r.status === 'WARN').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;

    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
      console.log(`${icon} ${result.name}: ${result.message}`);
      if (result.details) {
        console.log(`   └─ ${result.details}`);
      }
    });

    console.log(`\n📈 Summary: ${passed} passed, ${warned} warnings, ${failed} failed`);
    
    if (failed === 0 && warned <= 2) {
      console.log('🎉 STAGING DEPLOYMENT READY FOR PRODUCTION PROMOTION!');
    } else if (failed === 0) {
      console.log('⚠️  Staging deployment has warnings but is functional');
    } else {
      console.log('❌ Staging deployment has critical issues - fix before production');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const baseUrl = process.argv[2] || 'https://staging.tkafrokitchen.com';
  const tests = new StagingTests(baseUrl);
  tests.runAllTests().catch(console.error);
}

export default StagingTests;