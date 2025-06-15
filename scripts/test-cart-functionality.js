#!/usr/bin/env node

const http = require('http');

// Test cart functionality by checking the menu page renders correctly
async function testCartSetup() {
  console.log('🧪 Testing Cart Functionality Setup...\n');
  
  try {
    // Test menu page loads
    const response = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/menu', { timeout: 10000 }, (res) => {
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
      console.log('✅ Menu page loads successfully');
      
      // Check for key components
      const checks = [
        { name: 'FoodCard components', test: response.body.includes('data-slot="card"') },
        { name: 'Sheet dialogs', test: response.body.includes('aria-haspopup="dialog"') },
        { name: 'React hydration', test: response.body.includes('_next') },
        { name: 'No server errors', test: !response.body.includes('500') && !response.body.includes('Error') }
      ];
      
      let allPassed = true;
      checks.forEach(check => {
        const status = check.test ? '✅' : '❌';
        console.log(`${status} ${check.name}`);
        if (!check.test) allPassed = false;
      });
      
      if (allPassed) {
        console.log('\n🎉 All basic checks passed!');
        console.log('\n📋 To test cart functionality:');
        console.log('1. Open http://localhost:3001/menu in your browser');
        console.log('2. Click on any food item card');
        console.log('3. Select a size in the popup');
        console.log('4. Click "Add to Cart"');
        console.log('5. Check browser console for any error messages');
        console.log('6. Verify cart modal opens with the item');
        
        console.log('\n🔧 If you still get a 500 error:');
        console.log('- Open browser Developer Tools (F12)');
        console.log('- Go to Console tab');
        console.log('- Look for red error messages');
        console.log('- Check Network tab for failed requests');
        console.log('- Report the exact error message');
      } else {
        console.log('\n⚠️ Some checks failed - this might be causing the 500 error');
      }
      
    } else {
      console.log(`❌ Menu page failed: HTTP ${response.statusCode}`);
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

testCartSetup();