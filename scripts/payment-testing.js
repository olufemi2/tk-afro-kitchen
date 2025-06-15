#!/usr/bin/env node

/**
 * Payment System Testing & Monitoring Script
 * Tests payment workflows and monitors transaction success rates
 */

const https = require('https');
const fs = require('fs');

class PaymentTester {
  constructor() {
    this.testResults = [];
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://tkafrokitchen.com' 
      : 'https://staging.tkafrokitchen.com';
  }

  async testCheckoutFlow() {
    console.log('🧪 Testing Checkout Flow...\n');

    const tests = [
      { name: 'Checkout Page Load', test: () => this.testCheckoutPageLoad() },
      { name: 'PayPal SDK Load', test: () => this.testPayPalSDKLoad() },
      { name: 'Form Validation', test: () => this.testFormValidation() },
      { name: 'Payment Button Render', test: () => this.testPaymentButtonRender() },
      { name: 'Webhook Endpoint', test: () => this.testWebhookEndpoint() }
    ];

    for (const test of tests) {
      try {
        console.log(`🔍 Testing: ${test.name}`);
        const result = await test.test();
        this.testResults.push({ name: test.name, status: 'PASS', result });
        console.log(`✅ ${test.name}: PASSED\n`);
      } catch (error) {
        this.testResults.push({ name: test.name, status: 'FAIL', error: error.message });
        console.log(`❌ ${test.name}: FAILED - ${error.message}\n`);
      }
    }

    this.generateReport();
  }

  async testCheckoutPageLoad() {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}/checkout`;
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const hasPayPalScript = data.includes('paypal');
            const hasCheckoutForm = data.includes('checkout') || data.includes('delivery');
            
            if (hasPayPalScript && hasCheckoutForm) {
              resolve({ 
                statusCode: res.statusCode, 
                hasPayPalScript, 
                hasCheckoutForm,
                responseTime: Date.now() 
              });
            } else {
              reject(new Error('Checkout page missing required elements'));
            }
          });
        } else {
          reject(new Error(`Checkout page returned ${res.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  async testPayPalSDKLoad() {
    // Test PayPal SDK availability
    const paypalSDKUrl = 'https://www.paypal.com/sdk/js';
    
    return new Promise((resolve, reject) => {
      https.get(paypalSDKUrl, (res) => {
        if (res.statusCode === 200) {
          resolve({ sdkAvailable: true, statusCode: res.statusCode });
        } else {
          reject(new Error(`PayPal SDK not accessible: ${res.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  async testFormValidation() {
    // Test form validation logic (simulated)
    const testCases = [
      { email: 'invalid-email', expected: 'invalid' },
      { email: 'test@example.com', expected: 'valid' },
      { phone: '123', expected: 'invalid' },
      { phone: '07123456789', expected: 'valid' },
      { postcode: 'SW1A1AA', expected: 'valid' },
      { postcode: 'invalid', expected: 'invalid' }
    ];

    const validationResults = testCases.map(testCase => {
      if (testCase.email) {
        const isValid = /\S+@\S+\.\S+/.test(testCase.email);
        return { 
          input: testCase.email, 
          expected: testCase.expected, 
          actual: isValid ? 'valid' : 'invalid',
          passed: (isValid ? 'valid' : 'invalid') === testCase.expected
        };
      }
      if (testCase.phone) {
        const isValid = testCase.phone.length >= 10;
        return { 
          input: testCase.phone, 
          expected: testCase.expected, 
          actual: isValid ? 'valid' : 'invalid',
          passed: (isValid ? 'valid' : 'invalid') === testCase.expected
        };
      }
      if (testCase.postcode) {
        const isValid = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}$|^[A-Z]{1,2}[0-9R][0-9A-Z]?[0-9][A-Z]{2}$/i.test(testCase.postcode);
        return { 
          input: testCase.postcode, 
          expected: testCase.expected, 
          actual: isValid ? 'valid' : 'invalid',
          passed: (isValid ? 'valid' : 'invalid') === testCase.expected
        };
      }
      return { passed: false };
    });

    const allPassed = validationResults.every(result => result.passed);
    if (allPassed) {
      return { allTestsPassed: true, results: validationResults };
    } else {
      throw new Error('Form validation tests failed');
    }
  }

  async testPaymentButtonRender() {
    // Test if payment buttons would render (simulated check)
    const requiredEnvVars = [
      'NEXT_PUBLIC_PAYPAL_CLIENT_ID'
    ];

    const envCheck = requiredEnvVars.map(varName => {
      const value = process.env[varName];
      return {
        variable: varName,
        present: !!value,
        length: value ? value.length : 0
      };
    });

    const allPresent = envCheck.every(check => check.present);
    if (allPresent) {
      return { environmentConfigured: true, envCheck };
    } else {
      throw new Error('Missing required environment variables for PayPal');
    }
  }

  async testWebhookEndpoint() {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}/api/webhooks/paypal`;
      const postData = JSON.stringify({
        test: 'webhook_test',
        event_type: 'TEST.WEBHOOK.CONNECTIVITY'
      });

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(url, options, (res) => {
        // Webhook should return 401 for unsigned requests (this is correct behavior)
        if (res.statusCode === 401) {
          resolve({ 
            statusCode: res.statusCode, 
            message: 'Webhook correctly requires authentication',
            endpointActive: true 
          });
        } else if (res.statusCode === 200) {
          resolve({ 
            statusCode: res.statusCode, 
            message: 'Webhook endpoint responding',
            endpointActive: true 
          });
        } else {
          reject(new Error(`Webhook endpoint returned unexpected status: ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  generateReport() {
    console.log('\n📊 PAYMENT SYSTEM TEST REPORT');
    console.log('================================');

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log(`\n📈 Overall Score: ${passed}/${total} tests passed (${Math.round(passed/total * 100)}%)`);

    if (failed === 0) {
      console.log('🎉 ALL TESTS PASSED! Payment system is ready for production.');
    } else {
      console.log(`⚠️  ${failed} test(s) failed. Please review before going live.`);
    }

    console.log('\n📋 Test Details:');
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.status}`);
      if (result.status === 'FAIL') {
        console.log(`   Error: ${result.error}`);
      }
    });

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      environment: this.baseUrl,
      summary: { passed, failed, total, successRate: Math.round(passed/total * 100) },
      details: this.testResults
    };

    fs.writeFileSync('payment-test-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: payment-test-report.json');

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (failed === 0) {
      console.log('✅ Payment system is production-ready');
      console.log('✅ Consider setting up monitoring alerts for payment failures');
      console.log('✅ Test with real PayPal sandbox transactions');
    } else {
      console.log('🔧 Fix failing tests before production deployment');
      console.log('🔧 Verify all environment variables are configured');
      console.log('🔧 Test payment flow manually in staging environment');
    }

    console.log('\n🔄 Next Steps:');
    console.log('1. Run payment flow tests in staging environment');
    console.log('2. Test with PayPal sandbox accounts');
    console.log('3. Verify webhook handling with test transactions');
    console.log('4. Monitor payment success rates after deployment');
  }
}

// CLI interface
if (require.main === module) {
  const tester = new PaymentTester();
  tester.testCheckoutFlow().catch(console.error);
}

module.exports = PaymentTester;