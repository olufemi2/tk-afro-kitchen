#!/bin/bash

# Automated Deployment Setup Script
# This script helps you configure the automated deployment system

set -e

echo "🚀 TK Afro Kitchen - Automated Deployment Setup"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Function to prompt for environment variables
prompt_for_env_var() {
    local var_name=$1
    local description=$2
    local current_value="${!var_name}"
    
    echo ""
    echo "🔧 $description"
    if [ -n "$current_value" ]; then
        echo "   Current value: $current_value"
        read -p "   Keep current value? (y/n): " keep_current
        if [[ $keep_current == "y" || $keep_current == "Y" ]]; then
            return
        fi
    fi
    
    read -p "   Enter $var_name: " value
    if [ -n "$value" ]; then
        export $var_name="$value"
        echo "export $var_name=\"$value\"" >> .env.local
    fi
}

# Create .env.local file
echo "📝 Setting up environment variables..."
echo "# Automated Deployment Configuration" > .env.local
echo "# Generated on $(date)" >> .env.local
echo "" >> .env.local

# IONOS API Configuration
echo "🔐 IONOS API Configuration"
echo "   Get your API key from: https://developer.hosting.ionos.com/keys"
echo "   Your API key will be in format: prefix.secret"

prompt_for_env_var "IONOS_API_KEY" "IONOS API Key Prefix (the part before the dot)"
prompt_for_env_var "IONOS_API_SECRET" "IONOS API Secret (the part after the dot)"

# Vercel Configuration
echo ""
echo "🔐 Vercel Configuration"
echo "   Get your token from: https://vercel.com/account/tokens"
echo "   Get your project ID from: https://vercel.com/dashboard → Your Project → Settings → General"

prompt_for_env_var "VERCEL_TOKEN" "Vercel API Token"
prompt_for_env_var "VERCEL_PROJECT_ID" "Vercel Project ID"

# Optional: Vercel Production URL
echo ""
echo "🔧 Optional: Custom Vercel Production URL"
echo "   Leave empty to auto-detect from deployment"
read -p "   Vercel Production URL (optional): " vercel_prod_url
if [ -n "$vercel_prod_url" ]; then
    echo "export VERCEL_PRODUCTION_URL=\"$vercel_prod_url\"" >> .env.local
fi

# Make scripts executable
chmod +x scripts/dns-automation.js
chmod +x scripts/setup-automation.sh

# Add to .gitignore
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    echo ".env.local" >> .gitignore
    echo "🔒 Added .env.local to .gitignore for security"
fi

# Update package.json scripts
echo ""
echo "📦 Updating package.json scripts..."

# Check if the automated scripts already exist
if ! grep -q "deploy:staging:auto" package.json; then
    # Create backup of package.json
    cp package.json package.json.backup
    
    # Add new scripts using Node.js to safely modify JSON
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Add automated deployment scripts
    pkg.scripts = {
        ...pkg.scripts,
        'deploy:staging:auto': 'source .env.local && node scripts/dns-automation.js staging',
        'deploy:production:auto': 'source .env.local && node scripts/dns-automation.js production',
        'setup:automation': 'bash scripts/setup-automation.sh',
        'test:dns': 'source .env.local && node scripts/dns-automation.js test'
    };
    
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log('✅ Updated package.json with automated deployment scripts');
    "
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Available Commands:"
echo "   npm run deploy:staging:auto    - Deploy to staging with DNS automation"
echo "   npm run deploy:production:auto - Deploy to production with DNS automation"
echo "   npm run setup:automation       - Re-run this setup script"
echo "   npm run test:dns              - Test DNS automation (dry run)"
echo ""
echo "🔧 Configuration saved to .env.local"
echo "   Make sure to keep this file secure and don't commit it to git!"
echo ""
echo "📝 Next Steps:"
echo "   1. Verify your API credentials are correct"
echo "   2. Test with: npm run deploy:staging:auto"
echo "   3. Monitor the deployment process"
echo "   4. Check your website after DNS propagation (5-15 minutes)"
echo ""
echo "⚠️  First-time setup notes:"
echo "   • DNS changes may take 5-15 minutes to propagate"
echo "   • SSL certificates are automatically provisioned by Vercel"
echo "   • Email functionality will continue to work (MX records preserved)"
echo ""