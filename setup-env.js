#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 TK Afro Kitchen - Automated Deployment Setup');
console.log('==================================================\n');

const questions = [
  {
    key: 'IONOS_API_KEY',
    question: '🔐 Enter your IONOS API Key (prefix part before the dot): ',
    description: 'Get this from: https://developer.hosting.ionos.com/keys'
  },
  {
    key: 'IONOS_API_SECRET', 
    question: '🔐 Enter your IONOS API Secret (part after the dot): ',
    description: 'This is the second part of your IONOS API key'
  },
  {
    key: 'VERCEL_TOKEN',
    question: '🔐 Enter your Vercel API Token: ',
    description: 'Get this from: https://vercel.com/account/tokens'
  },
  {
    key: 'VERCEL_PROJECT_ID',
    question: '🔐 Enter your Vercel Project ID: ',
    description: 'Get this from: Vercel Dashboard → Your Project → Settings → General'
  },
  {
    key: 'VERCEL_PRODUCTION_URL',
    question: '🔧 Enter your Vercel Production URL (optional, press Enter to skip): ',
    description: 'Leave empty to auto-detect from deployment',
    optional: true
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    if (question.description) {
      console.log(`\n📝 ${question.description}`);
    }
    rl.question(question.question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupEnvironment() {
  const envVars = {};
  
  for (const question of questions) {
    const answer = await askQuestion(question);
    if (answer || !question.optional) {
      envVars[question.key] = answer;
    }
  }
  
  // Create .env.local file
  const envContent = [
    '# Automated Deployment Configuration',
    `# Generated on ${new Date().toISOString()}`,
    '',
    ...Object.entries(envVars).map(([key, value]) => `${key}="${value}"`)
  ].join('\n');
  
  fs.writeFileSync('.env.local', envContent);
  
  // Add to .gitignore if not already there
  const gitignorePath = '.gitignore';
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('.env.local')) {
      fs.appendFileSync(gitignorePath, '\n.env.local\n');
      console.log('🔒 Added .env.local to .gitignore for security');
    }
  }
  
  console.log('\n🎉 Setup completed successfully!');
  console.log('\n📋 Available Commands:');
  console.log('   npm run deploy:staging:auto    - Deploy to staging with DNS automation');
  console.log('   npm run deploy:production:auto - Deploy to production with DNS automation');
  console.log('   npm run check:deployment       - Check deployment status');
  console.log('\n🔧 Configuration saved to .env.local');
  console.log('   Make sure to keep this file secure and don\'t commit it to git!');
  
  console.log('\n📝 Next Steps:');
  console.log('   1. Test with: npm run deploy:staging:auto');
  console.log('   2. Monitor with: npm run check:deployment');
  console.log('   3. Check your website after DNS propagation (5-15 minutes)');
  
  rl.close();
}

setupEnvironment().catch(console.error);