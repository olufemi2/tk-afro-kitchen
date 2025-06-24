#!/usr/bin/env node

const http = require('http');
const https = require('https');

async function testSafariFixes() {
  console.log('🧪 Testing Safari Fixes for TK Afro Kitchen...\n');
  
  const testUrls = [
    'http://localhost:3001',
    'https://staging.tkafrokitchen.com'
  ];
  
  console.log('🔍 Testing Homepage Links...');
  for (const baseUrl of testUrls) {
    console.log(`\nTesting: ${baseUrl}`);
    
    try {
      const response = await new Promise((resolve, reject) => {
        const protocol = baseUrl.startsWith('https') ? https : http;
        const req = protocol.request(baseUrl, { timeout: 10000 }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({ statusCode: res.statusCode, body: data });
          });
        });
        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Request timeout')));
        req.end();
      });
      
      if (response.statusCode === 200) {
        // Check for Safari-specific fixes in the HTML
        const hasSafariCSS = response.body.includes('-webkit-touch-callout: none') || 
                            response.body.includes('-webkit-tap-highlight-color');
        const hasSafariJS = response.body.includes('handleSafariLink') || 
                           response.body.includes('isSafari');
        const hasNavigationLinks = response.body.includes('/menu') && 
                                  response.body.includes('/about') && 
                                  response.body.includes('/contact');
        
        console.log(`✅ Status: ${response.statusCode}`);
        console.log(`✅ Safari CSS Fixes: ${hasSafariCSS ? 'Found' : 'Missing'}`);
        console.log(`✅ Safari JS Fixes: ${hasSafariJS ? 'Found' : 'Missing'}`);
        console.log(`✅ Navigation Links: ${hasNavigationLinks ? 'Found' : 'Missing'}`);
        console.log(`✅ Page Length: ${response.body.length} characters`);
      } else {
        console.log(`❌ Status: ${response.statusCode}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🔍 Testing Success Page...');
  for (const baseUrl of testUrls) {
    const successUrl = `${baseUrl}/success`;
    console.log(`\nTesting: ${successUrl}`);
    
    try {
      const response = await new Promise((resolve, reject) => {
        const protocol = successUrl.startsWith('https') ? https : http;
        const req = protocol.request(successUrl, { timeout: 10000 }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({ statusCode: res.statusCode, body: data });
          });
        });
        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Request timeout')));
        req.end();
      });
      
      if (response.statusCode === 200) {
        const hasSuccessContent = response.body.includes('Payment Successful') || 
                                 response.body.includes('Order Confirmation');
        const hasSafariHandling = response.body.includes('isSafari') || 
                                 response.body.includes('localStorage');
        const hasLoadingState = response.body.includes('Loading your order confirmation');
        
        console.log(`✅ Status: ${response.statusCode}`);
        console.log(`✅ Success Content: ${hasSuccessContent ? 'Found' : 'Missing'}`);
        console.log(`✅ Safari Handling: ${hasSafariHandling ? 'Found' : 'Missing'}`);
        console.log(`✅ Loading State: ${hasLoadingState ? 'Found' : 'Missing'}`);
      } else {
        console.log(`❌ Status: ${response.statusCode}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

async function provideSafariTestingInstructions() {
  console.log('\n📋 Safari Testing Instructions:');
  console.log('='*50);
  
  console.log('\n1. 🧪 Test Payment Success in Safari:');
  console.log('   - Open Safari browser');
  console.log('   - Go to your site and complete a test payment');
  console.log('   - Check if success page loads properly');
  console.log('   - Verify order details are displayed');
  
  console.log('\n2. 🔗 Test Homepage Links in Safari:');
  console.log('   - Click on "Browse Our Menu" button');
  console.log('   - Click on "About Us" button');
  console.log('   - Click on navigation menu items');
  console.log('   - Verify all links navigate correctly');
  
  console.log('\n3. 🐛 Debug Safari Issues:');
  console.log('   - Open Safari Developer Tools (Develop > Show Web Inspector)');
  console.log('   - Check Console for any error messages');
  console.log('   - Look for "Safari detected" log messages');
  console.log('   - Test in both desktop and mobile Safari');
  
  console.log('\n4. 🔧 Common Safari Issues to Check:');
  console.log('   - Payment redirect not working');
  console.log('   - Links not responding to clicks');
  console.log('   - localStorage access issues');
  console.log('   - CSS hover effects not working');
  
  console.log('\n5. ✅ Success Indicators:');
  console.log('   - Payment success page loads after payment');
  console.log('   - All navigation links work properly');
  console.log('   - No console errors in Safari');
  console.log('   - Smooth navigation between pages');
}

async function runSafariTests() {
  await testSafariFixes();
  await provideSafariTestingInstructions();
}

runSafariTests().catch(console.error); 