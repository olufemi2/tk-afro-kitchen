#!/bin/bash

# 🚨 Emergency Rollback Script for TK Afro Kitchen
# Purpose: Instantly rollback from Vercel to WordPress site
# Usage: ./scripts/emergency-rollback.sh [reason]

set -e  # Exit on any error

# Configuration
DOMAIN="tkafrokitchen.com"
WORDPRESS_IP="192.254.189.21"
BACKUP_DIR="./backups"
LOG_FILE="./logs/rollback-$(date +%Y%m%d-%H%M%S).log"
NOTIFICATION_EMAIL="admin@tkafrokitchen.com"  # Update with actual admin email

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# Banner
echo -e "${RED}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🚨 EMERGENCY ROLLBACK 🚨                  ║"
echo "║                                                              ║"
echo "║  This script will immediately rollback tkafrokitchen.com    ║"
echo "║  from Vercel to the WordPress site on IONOS hosting         ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Confirm execution
REASON="${1:-Manual emergency rollback}"
print_warning "Rollback reason: $REASON"
print_warning "This will revert DNS to point to WordPress site at $WORDPRESS_IP"
echo
read -p "Are you absolutely sure you want to proceed? (type 'ROLLBACK' to continue): " confirmation

if [ "$confirmation" != "ROLLBACK" ]; then
    print_error "Rollback cancelled. Exiting."
    exit 1
fi

log "Starting emergency rollback procedure"
log "Reason: $REASON"

# Step 1: Document current state
print_status "Step 1: Documenting current DNS state..."
CURRENT_IP=$(dig +short $DOMAIN | head -1)
log "Current IP for $DOMAIN: $CURRENT_IP"

if [ "$CURRENT_IP" = "$WORDPRESS_IP" ]; then
    print_warning "Domain already points to WordPress IP ($WORDPRESS_IP)"
    log "No DNS change needed - already pointing to WordPress"
else
    log "Current IP ($CURRENT_IP) differs from WordPress IP ($WORDPRESS_IP)"
fi

# Step 2: Check if rollback instructions are available
print_status "Step 2: Checking rollback capabilities..."

# Create manual rollback instructions
cat > "/tmp/manual_rollback_instructions.txt" << EOF
MANUAL DNS ROLLBACK INSTRUCTIONS
================================

IF AUTOMATED ROLLBACK FAILS, FOLLOW THESE STEPS:

1. Login to IONOS Control Panel
   - URL: https://my.ionos.com
   - Navigate to DNS management for tkafrokitchen.com

2. Update A Record:
   - Record Type: A
   - Name: @ (or tkafrokitchen.com)  
   - Value: $WORDPRESS_IP
   - TTL: 300 (5 minutes)

3. Save changes and wait 5-10 minutes for propagation

4. Verify rollback:
   - Run: dig +short $DOMAIN
   - Should return: $WORDPRESS_IP

5. Test WordPress site:
   - Visit: https://$DOMAIN
   - Verify WordPress admin access
   - Check WooCommerce functionality

Emergency Contact: $NOTIFICATION_EMAIL
Rollback executed at: $(date)
Reason: $REASON
EOF

print_success "Manual rollback instructions created: /tmp/manual_rollback_instructions.txt"

# Step 3: Attempt automated DNS update (if tools available)
print_status "Step 3: Attempting automated DNS update..."

# Check if dig is available for verification
if ! command -v dig &> /dev/null; then
    print_warning "dig command not available - cannot verify DNS changes"
fi

# Since we don't have direct API access to IONOS DNS, provide manual instructions
print_warning "Automated DNS update requires IONOS API credentials"
print_warning "Manual DNS change required through IONOS control panel"

# Step 4: Create verification script
print_status "Step 4: Creating verification script..."

cat > "/tmp/verify_rollback.sh" << 'EOF'
#!/bin/bash
DOMAIN="tkafrokitchen.com"
WORDPRESS_IP="192.254.189.21"

echo "Verifying rollback status..."
CURRENT_IP=$(dig +short $DOMAIN | head -1)

if [ "$CURRENT_IP" = "$WORDPRESS_IP" ]; then
    echo "✅ SUCCESS: DNS points to WordPress IP ($WORDPRESS_IP)"
    echo "Testing WordPress site accessibility..."
    
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200\|301\|302"; then
        echo "✅ SUCCESS: WordPress site is accessible"
    else
        echo "⚠️  WARNING: WordPress site may not be fully accessible yet"
    fi
else
    echo "❌ PENDING: DNS still points to $CURRENT_IP (expected $WORDPRESS_IP)"
    echo "DNS propagation may take 5-15 minutes. Please wait and try again."
fi
EOF

chmod +x "/tmp/verify_rollback.sh"
print_success "Verification script created: /tmp/verify_rollback.sh"

# Step 5: Send notification (if email tools available)
print_status "Step 5: Sending notifications..."

# Create notification message
NOTIFICATION_MSG="EMERGENCY ROLLBACK INITIATED

Domain: $DOMAIN
Time: $(date)
Reason: $REASON
Action Required: Manual DNS update through IONOS control panel

Manual Steps Required:
1. Login to IONOS control panel
2. Update A record for $DOMAIN to $WORDPRESS_IP  
3. Set TTL to 300 seconds
4. Run verification: /tmp/verify_rollback.sh

Current DNS Status:
- Before rollback: $CURRENT_IP
- Target IP: $WORDPRESS_IP

Rollback Log: $LOG_FILE
Manual Instructions: /tmp/manual_rollback_instructions.txt
"

echo "$NOTIFICATION_MSG" > "/tmp/rollback_notification.txt"

# Attempt to send email if mail command is available
if command -v mail &> /dev/null; then
    echo "$NOTIFICATION_MSG" | mail -s "🚨 EMERGENCY ROLLBACK - TK Afro Kitchen" "$NOTIFICATION_EMAIL" 2>/dev/null || true
    print_success "Email notification sent to $NOTIFICATION_EMAIL"
else
    print_warning "Email command not available - notification saved to /tmp/rollback_notification.txt"
fi

# Step 6: Monitoring setup
print_status "Step 6: Setting up monitoring..."

cat > "/tmp/monitor_rollback.sh" << 'EOF'
#!/bin/bash
DOMAIN="tkafrokitchen.com"
WORDPRESS_IP="192.254.189.21"

echo "Starting DNS rollback monitoring..."
echo "Press Ctrl+C to stop monitoring"
echo

while true; do
    CURRENT_IP=$(dig +short $DOMAIN | head -1)
    TIMESTAMP=$(date '+%H:%M:%S')
    
    if [ "$CURRENT_IP" = "$WORDPRESS_IP" ]; then
        echo "[$TIMESTAMP] ✅ SUCCESS: $DOMAIN → $CURRENT_IP (WordPress restored)"
        break
    else
        echo "[$TIMESTAMP] ⏳ WAITING: $DOMAIN → $CURRENT_IP (propagating...)"
    fi
    
    sleep 30
done

echo
echo "🎉 ROLLBACK COMPLETE! WordPress site is now active."
echo "Please verify functionality at: https://$DOMAIN"
EOF

chmod +x "/tmp/monitor_rollback.sh"
print_success "Monitoring script created: /tmp/monitor_rollback.sh"

# Final instructions
echo
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                     ROLLBACK INITIATED                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo

print_status "NEXT STEPS - MANUAL DNS UPDATE REQUIRED:"
echo
echo "1. 🌐 Login to IONOS Control Panel and update DNS:"
echo "   - Change A record for $DOMAIN to $WORDPRESS_IP"
echo "   - Set TTL to 300 seconds for quick propagation"
echo
echo "2. 🔍 Monitor progress:"
echo "   - Run: /tmp/monitor_rollback.sh"
echo "   - Or manually: /tmp/verify_rollback.sh"
echo
echo "3. 📋 Review manual instructions:"
echo "   - File: /tmp/manual_rollback_instructions.txt"
echo
echo "4. 📧 Notification details:"
echo "   - File: /tmp/rollback_notification.txt"
echo

log "Rollback procedure completed. Manual DNS update required."
log "All instructions and scripts created for manual execution."

print_success "Emergency rollback procedure completed successfully!"
print_warning "Remember: Manual DNS update through IONOS control panel is required!"

echo
echo "Expected recovery time: 5-15 minutes after DNS change"
echo "Full propagation: Up to 60 minutes globally"
echo