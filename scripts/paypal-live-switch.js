#!/usr/bin/env node

/**
 * PayPal Live Environment Switcher
 * Automates switching between PayPal Sandbox and Live environments
 * Can be run remotely through Vercel CLI or GitHub Actions
 */

const fs = require('fs');
const path = require('path');

// Environment configuration
const ENVIRONMENTS = {
  sandbox: {
    name: 'PayPal Sandbox (Testing)',
    api_base: 'https://api-m.sandbox.paypal.com',
    client_id_env: 'NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID',
    description: 'Safe testing environment with fake money'
  },
  live: {
    name: 'PayPal Live (Production)',
    api_base: 'https://api-m.paypal.com',
    client_id_env: 'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
    description: 'Real money transactions - use with caution!'
  }
};

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  const border = '='.repeat(60);
  log(border, 'cyan');
  log(`  ${title}`, 'cyan');
  log(border, 'cyan');
}

function logSection(title) {
  log(`\n📋 ${title}`, 'blue');
  log('-'.repeat(title.length + 5), 'blue');
}

// Check current environment
function getCurrentEnvironment() {
  const envFile = path.join(process.cwd(), '.env.local');
  
  try {
    if (!fs.existsSync(envFile)) {
      return 'unknown';
    }
    
    const content = fs.readFileSync(envFile, 'utf8');
    
    // Check for live client ID pattern (starts with 'AX')
    if (content.includes('NEXT_PUBLIC_PAYPAL_CLIENT_ID=AX')) {
      return 'live';
    }
    // Check for sandbox client ID pattern (starts with 'AS' or 'AB')
    else if (content.includes('NEXT_PUBLIC_PAYPAL_CLIENT_ID=A')) {
      return 'sandbox';
    }
    
    return 'unknown';
  } catch (error) {
    return 'error';
  }
}

// Validate PayPal Client ID format
function validateClientId(clientId, environment) {
  if (!clientId || clientId.length < 50) {
    return false;
  }
  
  if (environment === 'live' && !clientId.startsWith('AX')) {
    log('⚠️  Live Client IDs typically start with "AX"', 'yellow');
  }
  
  if (environment === 'sandbox' && !clientId.startsWith('A')) {
    log('⚠️  Sandbox Client IDs typically start with "A"', 'yellow');
  }
  
  return true;
}

// Create environment file
function createEnvironmentFile(environment, clientId, webhookId) {
  const envFile = path.join(process.cwd(), '.env.local');
  const envConfig = ENVIRONMENTS[environment];
  
  const envContent = `# TK Afro Kitchen - ${envConfig.name}
# Generated on ${new Date().toISOString()}

# PayPal Configuration - ${environment.toUpperCase()} Environment
NEXT_PUBLIC_PAYPAL_CLIENT_ID=${clientId}
PAYPAL_WEBHOOK_ID=${webhookId}
NODE_ENV=${environment === 'live' ? 'production' : 'development'}

# PayPal API Base URL (for reference)
# API_BASE=${envConfig.api_base}

# Email Configuration (Update with your SMTP settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# Application Environment
NEXT_PUBLIC_ENVIRONMENT=${environment}
`;

  try {
    fs.writeFileSync(envFile, envContent);
    return true;
  } catch (error) {
    log(`❌ Error writing environment file: ${error.message}`, 'red');
    return false;
  }
}

// Main switch function
function switchEnvironment() {
  logHeader('PayPal Environment Switcher - TK Afro Kitchen');
  
  const currentEnv = getCurrentEnvironment();
  
  logSection('Current Environment Status');
  if (currentEnv === 'unknown') {
    log('🤷 No PayPal configuration detected', 'yellow');
  } else if (currentEnv === 'error') {
    log('❌ Error reading environment configuration', 'red');
  } else {
    const envConfig = ENVIRONMENTS[currentEnv];
    log(`🎯 Current: ${envConfig.name}`, 'green');
    log(`   Description: ${envConfig.description}`, 'white');
  }
  
  logSection('Available Environments');
  Object.entries(ENVIRONMENTS).forEach(([key, config], index) => {
    const marker = currentEnv === key ? '👉' : '  ';
    log(`${marker} ${index + 1}. ${config.name}`, currentEnv === key ? 'green' : 'white');
    log(`     ${config.description}`, 'white');
  });
  
  // Interactive mode
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  log('\n🔄 Switch PayPal Environment', 'cyan');
  rl.question('Enter environment (sandbox/live) or "status" to check current: ', (answer) => {
    const choice = answer.toLowerCase().trim();
    
    if (choice === 'status') {
      log(`\n📊 Current environment: ${currentEnv}`, 'blue');
      rl.close();
      return;
    }
    
    if (!ENVIRONMENTS[choice]) {
      log('❌ Invalid choice. Please enter "sandbox" or "live"', 'red');
      rl.close();
      return;
    }
    
    if (choice === currentEnv) {
      log(`✅ Already using ${ENVIRONMENTS[choice].name}`, 'green');
      rl.close();
      return;
    }
    
    // Switching to new environment
    const newEnv = ENVIRONMENTS[choice];
    log(`\n🔄 Switching to ${newEnv.name}...`, 'yellow');
    
    if (choice === 'live') {
      log('\n⚠️  IMPORTANT: Live Environment Checklist', 'red');
      log('   • PayPal Business Account verified?', 'yellow');
      log('   • Bank account linked and verified?', 'yellow');
      log('   • Payment receiving limits removed?', 'yellow');
      log('   • Ready for real money transactions?', 'yellow');
      
      rl.question('\nContinue with Live environment? (yes/no): ', (confirm) => {
        if (confirm.toLowerCase() !== 'yes') {
          log('❌ Cancelled switching to live environment', 'yellow');
          rl.close();
          return;
        }
        
        collectCredentials(rl, choice);
      });
    } else {
      collectCredentials(rl, choice);
    }
  });
}

function collectCredentials(rl, environment) {
  log(`\n🔑 Enter ${ENVIRONMENTS[environment].name} Credentials`, 'cyan');
  
  rl.question('PayPal Client ID: ', (clientId) => {
    if (!validateClientId(clientId, environment)) {
      log('❌ Invalid Client ID format', 'red');
      rl.close();
      return;
    }
    
    rl.question('PayPal Webhook ID (optional): ', (webhookId) => {
      if (createEnvironmentFile(environment, clientId, webhookId || 'not_configured')) {
        log(`\n✅ Successfully switched to ${ENVIRONMENTS[environment].name}!`, 'green');
        log('\n📋 Next Steps:', 'blue');
        log('   1. Test the integration with a small payment', 'white');
        log('   2. Verify webhook endpoints are working', 'white');
        log('   3. Deploy to production when ready', 'white');
        
        if (environment === 'live') {
          log('\n⚠️  Production Reminders:', 'yellow');
          log('   • Monitor transactions closely', 'white');
          log('   • Have customer support ready', 'white');
          log('   • Keep sandbox environment for testing', 'white');
        }
      }
      
      rl.close();
    });
  });
}

// Vercel deployment helper
function generateVercelCommands(environment, clientId, webhookId) {
  log('\n🚀 Vercel Deployment Commands', 'cyan');
  log('Run these commands to deploy to Vercel:', 'white');
  log('');
  log(`vercel env add NEXT_PUBLIC_PAYPAL_CLIENT_ID production`, 'green');
  log(`# Enter: ${clientId}`, 'white');
  log('');
  log(`vercel env add PAYPAL_WEBHOOK_ID production`, 'green');
  log(`# Enter: ${webhookId}`, 'white');
  log('');
  log(`vercel env add NODE_ENV production`, 'green');
  log(`# Enter: ${environment === 'live' ? 'production' : 'development'}`, 'white');
  log('');
  log('vercel --prod', 'green');
  log('');
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    logHeader('PayPal Environment Switcher - Help');
    log('Usage: node paypal-live-switch.js [options]', 'white');
    log('');
    log('Options:', 'blue');
    log('  --help, -h     Show this help message', 'white');
    log('  --status, -s   Show current environment status', 'white');
    log('  --interactive  Run in interactive mode (default)', 'white');
    log('');
    log('Examples:', 'blue');
    log('  node paypal-live-switch.js', 'green');
    log('  node paypal-live-switch.js --status', 'green');
    process.exit(0);
  }
  
  if (args.includes('--status') || args.includes('-s')) {
    logHeader('PayPal Environment Status');
    const currentEnv = getCurrentEnvironment();
    if (currentEnv === 'unknown') {
      log('🤷 No PayPal configuration detected', 'yellow');
    } else if (currentEnv === 'error') {
      log('❌ Error reading environment configuration', 'red');
    } else {
      const envConfig = ENVIRONMENTS[currentEnv];
      log(`🎯 Current: ${envConfig.name}`, 'green');
      log(`   Description: ${envConfig.description}`, 'white');
      log(`   API Base: ${envConfig.api_base}`, 'white');
    }
    process.exit(0);
  }
  
  // Default: interactive mode
  switchEnvironment();
}

module.exports = {
  getCurrentEnvironment,
  switchEnvironment,
  validateClientId,
  createEnvironmentFile,
  ENVIRONMENTS
};