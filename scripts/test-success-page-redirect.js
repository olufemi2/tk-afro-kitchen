#!/usr/bin/env node

const http = require('http');

async function testSuccessPageAccess() {
  console.log('🧪 Testing Success Page Access...\n');
  
  const testUrls = [
    'http://localhost:3001/success',
    'https://staging.tkafrokitchen.com/success'
  ];
  
  for (const url of testUrls) {
    console.log(`Testing: ${url}`);
    
    try {
      const response = await new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? require('https') : http;
        const req = protocol.request(url, { timeout: 10000 }, (res) => {
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
        console.log(`✅ Status: ${response.statusCode}`);
        console.log(`✅ Success Content: ${hasSuccessContent ? 'Found' : 'Missing'}`);
        console.log(`✅ Page Length: ${response.body.length} characters`);
      } else {
        console.log(`❌ Status: ${response.statusCode}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

async function createTestOrderData() {
  console.log('📝 Creating Test Order Data for Success Page...\n');
  
  const testOrderData = {
    orderId: 'TEST_ORDER_' + Date.now(),
    status: 'COMPLETED',
    amount: '45.99',
    timestamp: new Date().toISOString(),
    customerInfo: {
      fullName: 'Test Customer',
      email: 'test@example.com',
      phone: '07123 456789',
      address: '123 Test Street',
      city: 'London',
      postcode: 'SW1A 1AA'
    }
  };
  
  console.log('Test order data to store in localStorage:');
  console.log(JSON.stringify(testOrderData, null, 2));
  
  console.log('\n📋 Manual Test Instructions:');
  console.log('1. Open browser console on success page');
  console.log('2. Run this command:');
  console.log(`localStorage.setItem('lastOrderDetails', '${JSON.stringify(testOrderData)}');`);
  console.log('3. Refresh the page');
  console.log('4. Should see order confirmation details');
}

async function analyzeRedirectIssue() {
  console.log('🔍 ANALYZING SUCCESS PAGE REDIRECT ISSUE...\n');
  
  console.log('Common causes of success page not showing:');
  console.log('1. ❌ PayPal payment not completing properly');
  console.log('2. ❌ handlePaymentSuccess not being called');
  console.log('3. ❌ router.push(\'/success\') failing');
  console.log('4. ❌ Success page has rendering errors');
  console.log('5. ❌ Browser redirecting back to PayPal');
  
  console.log('\n🔧 Debugging steps:');
  console.log('1. Check browser console during payment');
  console.log('2. Look for PayPal onApprove console logs');
  console.log('3. Verify handlePaymentSuccess logs appear');
  console.log('4. Check if router.push logs show');
  console.log('5. Test success page directly: /success');
  
  console.log('\n💡 Quick Test:');
  console.log('Try accessing success page directly:');
  console.log('- Local: http://localhost:3001/success');
  console.log('- Staging: https://staging.tkafrokitchen.com/success');
}

async function runTests() {
  await testSuccessPageAccess();
  await createTestOrderData();
  await analyzeRedirectIssue();
}

runTests().catch(console.error);