#!/usr/bin/env node

/**
 * PayPal Live Integration Validation Script
 * Tests PayPal integration in live environment
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, status, details = '') {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  const color = status === 'pass' ? 'green' : status === 'fail' ? 'red' : 'yellow';
  
  log(`${icon} ${testName}`, color);
  if (details) {
    log(`   ${details}`, 'white');
  }
}

// Test environment configuration
function testEnvironmentConfig() {
  log('\n🔍 Testing Environment Configuration', 'cyan');
  log('━'.repeat(50), 'cyan');
  
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const nodeEnv = process.env.NODE_ENV;
  
  // Test Client ID
  if (!clientId) {
    logTest('PayPal Client ID', 'fail', 'NEXT_PUBLIC_PAYPAL_CLIENT_ID not found');
    return false;
  } else if (clientId.startsWith('AX')) {
    logTest('PayPal Client ID', 'pass', 'Live Client ID detected (starts with AX)');
  } else if (clientId.startsWith('AS') || clientId.startsWith('AB')) {
    logTest('PayPal Client ID', 'warn', 'Sandbox Client ID detected - switch to live for production');
  } else {
    logTest('PayPal Client ID', 'warn', 'Unusual Client ID format detected');
  }
  
  // Test Webhook ID
  if (!webhookId || webhookId === 'not_configured') {
    logTest('Webhook Configuration', 'warn', 'Webhook ID not configured - some features may not work');
  } else {
    logTest('Webhook Configuration', 'pass', `Webhook ID: ${webhookId.substring(0, 10)}...`);
  }
  
  // Test Node Environment
  if (nodeEnv === 'production') {
    logTest('Node Environment', 'pass', 'Production environment configured');
  } else {
    logTest('Node Environment', 'warn', `Current: ${nodeEnv} - consider "production" for live`);
  }
  
  return true;
}

// Test PayPal API connectivity
function testPayPalConnectivity() {
  return new Promise((resolve) => {
    log('\n🌐 Testing PayPal API Connectivity', 'cyan');
    log('━'.repeat(50), 'cyan');
    
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const isLive = clientId && clientId.startsWith('AX');
    const apiBase = isLive ? 'api-m.paypal.com' : 'api-m.sandbox.paypal.com';
    
    const options = {
      hostname: apiBase,
      port: 443,
      path: '/v1/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:`).toString('base64')}`
      },
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.access_token) {
            logTest('PayPal API Connection', 'pass', `Connected to ${isLive ? 'Live' : 'Sandbox'} API`);
            logTest('Access Token Generation', 'pass', 'Successfully generated access token');
          } else if (res.statusCode === 401) {
            logTest('PayPal API Connection', 'fail', 'Authentication failed - check Client ID');
          } else {
            logTest('PayPal API Connection', 'fail', `HTTP ${res.statusCode}: ${response.error_description || 'Unknown error'}`);
          }
        } catch (error) {
          logTest('PayPal API Connection', 'fail', 'Invalid response format');
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      logTest('PayPal API Connection', 'fail', `Network error: ${error.message}`);
      resolve();
    });
    
    req.on('timeout', () => {
      logTest('PayPal API Connection', 'fail', 'Request timeout - check internet connection');
      req.destroy();
      resolve();
    });
    
    req.write('grant_type=client_credentials');
    req.end();
  });
}

// Test webhook endpoint accessibility
function testWebhookEndpoint() {
  return new Promise((resolve) => {
    log('\n🔗 Testing Webhook Endpoint', 'cyan');
    log('━'.repeat(50), 'cyan');
    
    const webhookUrl = 'tkafrokitchen.com';
    const path = '/api/webhooks/paypal';
    
    const options = {
      hostname: webhookUrl,
      port: 443,
      path: path,
      method: 'GET',
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 405) {
        // 405 Method Not Allowed is expected for GET on webhook endpoint
        logTest('Webhook Endpoint', 'pass', `Endpoint accessible at https://${webhookUrl}${path}`);
      } else if (res.statusCode === 404) {
        logTest('Webhook Endpoint', 'fail', 'Webhook endpoint not found - check API routes');
      } else {
        logTest('Webhook Endpoint', 'warn', `HTTP ${res.statusCode} - endpoint may need configuration`);
      }
      resolve();
    });
    
    req.on('error', (error) => {
      logTest('Webhook Endpoint', 'fail', `Cannot reach webhook endpoint: ${error.message}`);
      resolve();
    });
    
    req.on('timeout', () => {
      logTest('Webhook Endpoint', 'fail', 'Webhook endpoint timeout');
      req.destroy();
      resolve();
    });
    
    req.end();
  });
}

// Test SSL certificate
function testSSLCertificate() {
  return new Promise((resolve) => {
    log('\n🔒 Testing SSL Certificate', 'cyan');
    log('━'.repeat(50), 'cyan');
    
    const options = {
      hostname: 'tkafrokitchen.com',
      port: 443,
      path: '/',
      method: 'HEAD',
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      
      if (cert && cert.valid_to) {
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const daysUntilExpiry = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry > 30) {
          logTest('SSL Certificate', 'pass', `Valid until ${validTo.toDateString()} (${daysUntilExpiry} days)`);
        } else if (daysUntilExpiry > 0) {
          logTest('SSL Certificate', 'warn', `Expires soon: ${validTo.toDateString()} (${daysUntilExpiry} days)`);
        } else {
          logTest('SSL Certificate', 'fail', `Expired on ${validTo.toDateString()}`);
        }
      } else {
        logTest('SSL Certificate', 'fail', 'No valid SSL certificate found');
      }
      
      resolve();
    });
    
    req.on('error', (error) => {
      logTest('SSL Certificate', 'fail', `SSL error: ${error.message}`);
      resolve();
    });
    
    req.on('timeout', () => {
      logTest('SSL Certificate', 'fail', 'SSL check timeout');
      req.destroy();
      resolve();
    });
    
    req.end();
  });
}

// Generate test report
function generateTestReport() {
  log('\n📊 PayPal Live Integration Summary', 'cyan');
  log('━'.repeat(50), 'cyan');
  
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const isLive = clientId && clientId.startsWith('AX');
  
  if (isLive) {
    log('🎯 Environment: PayPal Live (Production)', 'green');
    log('💰 Status: Real money transactions enabled', 'green');
    log('⚠️  Reminder: Test with small amounts first', 'yellow');
  } else {
    log('🧪 Environment: PayPal Sandbox (Testing)', 'blue');
    log('💳 Status: Test transactions only', 'blue');
    log('🔄 Next: Switch to live when ready', 'yellow');
  }
  
  log('\n📋 Pre-Go-Live Checklist:', 'blue');
  log('   □ PayPal Business Account verified', 'white');
  log('   □ Bank account linked and verified', 'white');
  log('   □ Payment receiving limits removed', 'white');
  log('   □ Test small payment (£1-5)', 'white');
  log('   □ Verify order confirmation process', 'white');
  log('   □ Customer support process ready', 'white');
  
  log('\n🔗 Useful Links:', 'blue');
  log('   • PayPal Dashboard: https://www.paypal.com/businessmanage', 'white');
  log('   • Developer Console: https://developer.paypal.com/', 'white');
  log('   • Transaction History: https://www.paypal.com/activity', 'white');
  log('   • Integration Guide: /PAYPAL_LIVE_MIGRATION_GUIDE.md', 'white');
}

// Main validation function
async function validatePayPalIntegration() {
  log('🔍 PayPal Live Integration Validator', 'cyan');
  log('=' .repeat(60), 'cyan');
  log('TK Afro Kitchen - Payment System Validation', 'cyan');
  log('=' .repeat(60), 'cyan');
  
  // Run all tests
  testEnvironmentConfig();
  await testPayPalConnectivity();
  await testWebhookEndpoint();
  await testSSLCertificate();
  
  generateTestReport();
  
  log('\n✨ Validation Complete!', 'green');
  log('Check results above and address any issues before going live.', 'white');
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    log('PayPal Live Integration Validator', 'cyan');
    log('');
    log('Usage: node paypal-live-validation.js [options]', 'white');
    log('');
    log('Options:', 'blue');
    log('  --help, -h     Show this help message', 'white');
    log('');
    log('This script validates your PayPal integration configuration', 'white');
    log('and tests connectivity to PayPal APIs.', 'white');
    process.exit(0);
  }
  
  validatePayPalIntegration().catch(console.error);
}

module.exports = { validatePayPalIntegration };