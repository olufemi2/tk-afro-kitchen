# 🌐 Current DNS Configuration - TK Afro Kitchen

**Domain:** tkafrokitchen.com  
**Date Documented:** 2025-06-15  
**Purpose:** Backup before migration to Vercel

---

## 📊 Current DNS Records

### Nameservers (IONOS)
```
ns1055.ui-dns.de.
ns1081.ui-dns.biz.
ns1055.ui-dns.com.
ns1070.ui-dns.org.
```

### A Records
```
tkafrokitchen.com → 192.254.189.21 (Apache/WordPress hosting)
```

### Mail (MX) Records
```
Priority 10: mx00.ionos.co.uk.
Priority 10: mx01.ionos.co.uk.
```

### TXT Records
```
"v=spf1 include:_spf-eu.ionos.com ~all"
```

### CNAME Records (Subdomains)
```
staging.tkafrokitchen.com → tk-afro-kitchen-b5u2vhdg0-olufemi2s-projects.vercel.app
                          → 216.198.79.129, 64.29.17.129
```

---

## 🔧 Current Hosting Configuration

### Main Site (tkafrokitchen.com)
- **IP Address:** 192.254.189.21
- **Server:** Apache
- **Platform:** WordPress with Astra theme + WooCommerce
- **Hosting Provider:** IONOS (formerly 1&1)
- **SSL:** Active (needs verification of provider)

### Staging Site (staging.tkafrokitchen.com)
- **Platform:** Vercel
- **Application:** Next.js React app
- **SSL:** Vercel-managed SSL
- **Status:** Active and functional

---

## 📧 Email Configuration

### Current Email Setup
- **Provider:** IONOS Email
- **MX Records:** mx00.ionos.co.uk, mx01.ionos.co.uk (Priority 10)
- **SPF Record:** Includes IONOS SPF configuration
- **Status:** ⚠️ Email will be UNAFFECTED by DNS changes to main site

### Email Preservation Notes
```bash
# IMPORTANT: Email services will continue working
# - MX records point to IONOS mail servers
# - Email accounts hosted separately from website
# - No changes needed to email configuration during migration
# - Existing email addresses will continue working
```

---

## 🔄 Migration DNS Changes Required

### New Configuration (Post-Migration)
```bash
# Changes needed for Vercel migration:
BEFORE: tkafrokitchen.com → A → 192.254.189.21
AFTER:  tkafrokitchen.com → CNAME → cname.vercel-dns.com

# Keep unchanged:
- Nameservers: ns1055.ui-dns.de, etc. (IONOS)
- MX Records: mx00.ionos.co.uk, mx01.ionos.co.uk  
- TXT Records: SPF configuration
- Other subdomains: As configured
```

### Vercel Domain Configuration
```bash
# In Vercel dashboard, configure:
1. Add custom domain: tkafrokitchen.com
2. Add custom domain: www.tkafrokitchen.com  
3. Verify DNS propagation
4. Enable SSL certificate
```

---

## 🚨 Emergency Rollback DNS Settings

### Quick Restoration Commands
```bash
# To immediately restore WordPress site:
# Update DNS record via IONOS control panel:

Record Type: A
Name: @ (or tkafrokitchen.com)
Value: 192.254.189.21
TTL: 300 (5 minutes for quick rollback)

# This will restore the WordPress site within 5-10 minutes
```

### DNS Management Access
```bash
# Access points for DNS changes:
- IONOS Control Panel: [customer must provide login details]
- Domain registrar: [if different from IONOS]
- DNS management interface: [specific URL needed]
```

---

## 🔍 DNS Verification Commands

### Pre-Migration Verification
```bash
# Verify current setup:
dig +short tkafrokitchen.com
# Expected: 192.254.189.21

dig +short MX tkafrokitchen.com  
# Expected: mx00.ionos.co.uk, mx01.ionos.co.uk

dig +short staging.tkafrokitchen.com
# Expected: Points to Vercel
```

### Post-Migration Verification
```bash
# After DNS change:
dig +short tkafrokitchen.com
# Expected: Points to Vercel IP

# Verify email still works:
dig +short MX tkafrokitchen.com
# Expected: Still mx00.ionos.co.uk, mx01.ionos.co.uk (unchanged)
```

---

## ⏱️ DNS Propagation Timeline

### Expected Propagation Times
```bash
# DNS changes propagation:
- Local ISP: 5-15 minutes
- Global DNS: 30-60 minutes  
- Complete propagation: Up to 24 hours

# TTL Settings Impact:
- Current TTL: [Need to check current TTL values]
- Recommended pre-migration: Lower TTL to 300 seconds
- This allows faster rollback if needed
```

### Monitoring Propagation
```bash
# Tools to monitor DNS changes:
1. whatsmydns.net - Global DNS propagation checker
2. dig commands from different locations
3. Browser testing from different networks
4. Mobile vs desktop testing
```

---

## 📋 Pre-Migration DNS Checklist

### 24 Hours Before Migration
```bash
☐ Lower TTL values to 300 seconds (5 minutes)
☐ Verify current DNS settings are documented
☐ Test DNS management panel access
☐ Confirm email services working normally
☐ Notify users of potential brief interruption
```

### During Migration
```bash
☐ Update A record to point to Vercel
☐ Monitor DNS propagation 
☐ Test new site functionality
☐ Verify email continues working
☐ Check all subdomains working
```

### Post-Migration
```bash
☐ Verify DNS fully propagated globally
☐ Test all site functionality 
☐ Confirm email delivery working
☐ Restore normal TTL values (3600 seconds)
☐ Update monitoring systems
```

---

**⚠️ CRITICAL NOTES:**
- Email services remain with IONOS and are unaffected
- DNS changes are reversible within 5-10 minutes
- Staging site proves Vercel hosting works correctly
- WordPress backup provides complete fallback option