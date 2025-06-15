#!/usr/bin/env node

const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, {
      timeout: 10000,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.end();
  });
}

async function checkMenuPage() {
  console.log('🔍 Testing Menu Page Load and Cart Integration...\n');
  
  try {
    const response = await makeRequest('http://localhost:3001/menu');
    
    if (response.statusCode === 200) {
      console.log('✅ Menu page loads successfully (HTTP 200)');
      
      const body = response.body;
      
      // Check for React hydration errors
      const hydrationChecks = [
        { name: 'React Components Loaded', test: body.includes('React') || body.includes('_next') },
        { name: 'Food Card Components', test: body.includes('card') || body.includes('Card') },
        { name: 'Sheet Components', test: body.includes('Sheet') || body.includes('dialog') },
        { name: 'JavaScript Bundles', test: body.includes('.js') },
        { name: 'No Obvious Errors', test: !body.includes('Error') && !body.includes('500') }
      ];
      
      console.log('\n📋 Component Loading Checks:');
      hydrationChecks.forEach(check => {
        const status = check.test ? '✅' : '❌';
        console.log(`${status} ${check.name}`);
      });
      
      // Check for specific elements that could cause issues
      const potentialIssues = [
        { name: 'LocalStorage Access', test: body.includes('localStorage') },
        { name: 'Document Access', test: body.includes('document') },
        { name: 'Window Access', test: body.includes('window') },
        { name: 'Client-side Only Code', test: body.includes('useEffect') }
      ];
      
      console.log('\n⚠️ Potential SSR/Hydration Issues:');
      potentialIssues.forEach(issue => {
        const status = issue.test ? '⚠️' : '✅';
        console.log(`${status} ${issue.name}: ${issue.test ? 'Present' : 'Not found'}`);
      });
      
      console.log('\n🎯 Recommendations:');
      console.log('1. Check browser console for JavaScript errors');
      console.log('2. Verify Sheet component renders correctly');
      console.log('3. Check if cart state is properly initialized');
      console.log('4. Test with browser dev tools network tab');
      
    } else {
      console.log(`❌ Menu page failed to load: HTTP ${response.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Error testing menu page: ${error.message}`);
  }
}

async function checkCartComponents() {
  console.log('\n🛒 CART COMPONENT ANALYSIS...\n');
  
  const fs = require('fs');
  const path = require('path');
  
  // Check if cart components exist and are properly configured
  const cartFiles = [
    'src/contexts/CartContext.tsx',
    'src/components/cart/CartModal.tsx',
    'src/components/food/food-card.tsx'
  ];
  
  cartFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for common issues
      const issues = [];
      
      if (file.includes('CartContext') && !content.includes("'use client'")) {
        issues.push('Missing "use client" directive');
      }
      
      if (file.includes('food-card') && !content.includes('useState')) {
        issues.push('Missing state management');
      }
      
      if (content.includes('localStorage') && !content.includes('useEffect')) {
        issues.push('localStorage access without proper effect handling');
      }
      
      if (issues.length > 0) {
        console.log(`   ⚠️ Potential issues: ${issues.join(', ')}`);
      } else {
        console.log('   ✅ No obvious issues detected');
      }
    } else {
      console.log(`❌ ${file} missing`);
    }
  });
}

async function suggestFixes() {
  console.log('\n🔧 SUGGESTED FIXES FOR CART 500 ERROR:\n');
  
  console.log('1. **Client-Side Hydration Issue**:');
  console.log('   - Add error boundaries around cart components');
  console.log('   - Ensure "use client" directive is present');
  console.log('   - Check for SSR/client mismatch');
  
  console.log('\n2. **Sheet Component Issues**:');
  console.log('   - Verify Radix UI Sheet component is properly installed');
  console.log('   - Check for conflicting CSS or z-index issues');
  console.log('   - Ensure portal containers are available');
  
  console.log('\n3. **State Management**:');
  console.log('   - Verify cart context is properly wrapped around app');
  console.log('   - Check localStorage access is handled safely');
  console.log('   - Ensure state updates are batched correctly');
  
  console.log('\n4. **Browser-Specific Debugging**:');
  console.log('   - Open browser dev tools and check Console tab');
  console.log('   - Look for JavaScript errors when clicking "Add to Cart"');
  console.log('   - Check Network tab for failed requests');
  console.log('   - Verify React DevTools show proper component tree');
}

async function runDebugSession() {
  console.log('🐛 DEBUGGING CART 500 ERROR...\n');
  
  await checkMenuPage();
  await checkCartComponents();
  await suggestFixes();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 NEXT STEPS:');
  console.log('1. Open http://localhost:3001/menu in browser');
  console.log('2. Open Developer Tools (F12)');
  console.log('3. Click on a food item to open the sheet');
  console.log('4. Click "Add to Cart" and check Console for errors');
  console.log('5. Report the specific error message found');
  console.log('='.repeat(60));
}

runDebugSession().catch(error => {
  console.error(`Debug session failed: ${error.message}`);
  process.exit(1);
});