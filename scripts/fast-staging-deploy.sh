#!/bin/bash
set -e

# Fast Staging Deployment Script
# This script optimizes the deployment process for immediate propagation

echo "🚀 Starting fast staging deployment..."

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Function to deploy to staging
deploy_to_staging() {
    echo "🔄 Deploying to staging..."
    
    # Force push to staging branch
    git push origin $CURRENT_BRANCH:staging --force-with-lease
    
    echo "✅ Pushed to staging branch"
    
    # Trigger Vercel deployment check
    echo "⏳ Checking deployment status..."
    
    # Wait a moment for Vercel to pick up the change
    sleep 5
    
    # Check if vercel CLI is available
    if command -v vercel &> /dev/null; then
        echo "🔍 Using Vercel CLI to check deployment..."
        vercel ls --scope tkafro 2>/dev/null || echo "📝 Run 'vercel login' to use CLI features"
    fi
    
    echo ""
    echo "🌐 Your staging site should be updating at:"
    echo "   https://staging.tkafrokitchen.com"
    echo ""
    echo "⏱️  Expected propagation time:"
    echo "   • Vercel build: 30-60 seconds"
    echo "   • CDN propagation: 10-30 seconds"
    echo "   • Total: ~1-2 minutes"
    echo ""
    echo "💡 Tips for faster propagation:"
    echo "   • Clear browser cache (Ctrl+F5 or Cmd+Shift+R)"
    echo "   • Check in incognito/private browsing mode"
    echo "   • Use staging.tkafrokitchen.com/?t=$(date +%s) to bypass cache"
    echo ""
}

# Function to optimize cache busting
add_cache_buster() {
    TIMESTAMP=$(date +%s)
    echo "🔄 Cache buster timestamp: $TIMESTAMP"
    echo "🌐 Test URL with cache buster:"
    echo "   https://staging.tkafrokitchen.com/?cb=$TIMESTAMP"
}

# Main deployment flow
case "$1" in
    "force"|"-f")
        echo "⚡ Force deployment mode"
        deploy_to_staging
        add_cache_buster
        ;;
    "status"|"-s")
        echo "📊 Checking current deployment status..."
        git log --oneline -5 staging 2>/dev/null || echo "No staging branch found"
        ;;
    "help"|"-h"|"")
        echo "📖 Fast Staging Deploy Script"
        echo ""
        echo "Usage:"
        echo "  ./scripts/fast-staging-deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  force, -f    Force deploy current branch to staging"
        echo "  status, -s   Check current staging status"
        echo "  help, -h     Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./scripts/fast-staging-deploy.sh force"
        echo "  ./scripts/fast-staging-deploy.sh status"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "💡 Use './scripts/fast-staging-deploy.sh help' for usage information"
        exit 1
        ;;
esac

echo "✨ Script completed!"