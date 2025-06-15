#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

// Import the DNS manager
const { IONOSDNSManager } = require('./dns-automation.js');

async function updateDNSOnly() {
  console.log('🔧 Updating DNS records only...\n');
  
  try {
    const ionosManager = new IONOSDNSManager();
    
    console.log('📋 Updating staging DNS...');
    await ionosManager.updateStagingDNS();
    
    console.log('\n📋 Updating production DNS...');
    await ionosManager.updateProductionDNS();
    
    console.log('\n🎉 DNS update completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   • Wait 5-15 minutes for DNS propagation');
    console.log('   • Test staging.tkafrokitchen.com');
    console.log('   • Test tkafrokitchen.com');
    console.log('   • SSL certificates will be provisioned automatically');
    
  } catch (error) {
    console.error('\n❌ DNS update failed:', error.message);
    process.exit(1);
  }
}

updateDNSOnly();