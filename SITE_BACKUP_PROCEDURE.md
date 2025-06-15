# 🛡️ TK Afro Kitchen - Site Backup & Promotion Procedure

## 📋 Overview
This document outlines the complete backup and promotion procedure for migrating from the current WordPress site to the new Next.js application.

## 🔄 Migration Plan
```
Current: tkafrokitchen.com (WordPress on HostGator/IONOS)
         ↓
Stage:   staging.tkafrokitchen.com (Next.js on Vercel) ← Testing phase
         ↓
Live:    tkafrokitchen.com (Next.js on Vercel) ← Promotion target
```

---

## 🚨 CRITICAL BACKUP PROCEDURES

### 1. WordPress Site Backup (BEFORE ANY CHANGES)

#### A. Database Backup
```bash
# Via cPanel/phpMyAdmin:
1. Login to HostGator/IONOS cPanel
2. Open phpMyAdmin
3. Select WordPress database
4. Click "Export" → "Quick" → "SQL format"
5. Download: tkafro_wordpress_backup_YYYY-MM-DD.sql
6. Store in secure location with timestamp
```

#### B. Files Backup
```bash
# Via FTP/File Manager:
1. Access HostGator/IONOS File Manager
2. Navigate to public_html (or domain folder)
3. Select all WordPress files
4. Create ZIP: tkafro_files_backup_YYYY-MM-DD.zip
5. Download complete backup
6. Verify backup size matches source

# Key directories to ensure are backed up:
- /wp-content/themes/
- /wp-content/plugins/
- /wp-content/uploads/
- /wp-config.php
- /.htaccess
```

#### C. WooCommerce Data Export
```bash
# Via WordPress Admin:
1. Login to WordPress admin
2. WooCommerce → Tools → Export
3. Export: Orders, Products, Customers
4. Save as CSV files with date stamps
5. Store alongside other backups
```

### 2. DNS Configuration Documentation

#### Current DNS Records (Document Before Changes)
```bash
# Record current settings:
Domain: tkafrokitchen.com
A Record: 192.254.189.21 (HostGator/IONOS)
TTL: [Document current TTL]
Nameservers: [Document current nameservers]

# Subdomain records:
staging.tkafrokitchen.com → Vercel (already configured)
www.tkafrokitchen.com → [Document current configuration]
```

#### SSL Certificate Backup
```bash
# Document current SSL setup:
- Certificate Authority: [Let's Encrypt/HostGator/Other]
- Expiration date: [Document]
- Installation method: [Auto/Manual]
```

---

## 🔄 PROMOTION PROCEDURE

### Phase 1: Pre-Promotion Verification

#### Staging Functionality Checklist
```bash
✅ Homepage loads correctly
✅ Menu page displays all items
✅ Cart functionality works
✅ Checkout process (pickup/delivery options)
✅ Payment integration (PayPal)
✅ Order confirmation
✅ Mobile responsiveness
✅ SSL certificate valid
✅ Performance acceptable
✅ SEO meta tags present
```

#### Content Migration Verification
```bash
✅ All menu items transferred
✅ Pricing matches current site
✅ Contact information correct
✅ Business hours accurate
✅ Images optimized and displaying
✅ Legal pages (Terms, Privacy) present
```

### Phase 2: DNS Cutover Preparation

#### Backup Current DNS Settings
```bash
# Before any changes, document:
1. Current A records
2. Current CNAME records  
3. Current MX records (email)
4. Current TXT records (SPF, DKIM)
5. Current nameserver configuration
```

#### Prepare New DNS Configuration
```bash
# New configuration will be:
tkafrokitchen.com → CNAME → cname.vercel-dns.com
www.tkafrokitchen.com → CNAME → cname.vercel-dns.com

# Keep existing:
- MX records (email unchanged)
- Other subdomains unaffected
```

### Phase 3: Go-Live Procedure

#### Step-by-Step Cutover
```bash
1. ⏰ Schedule maintenance window (low traffic period)
2. 📢 Notify stakeholders of planned change
3. 🔒 Put WordPress site in maintenance mode
4. 📥 Take final backup of WordPress site
5. 🌐 Update DNS records to point to Vercel
6. ⏱️ Monitor DNS propagation (15-60 minutes)
7. 🧪 Test new site functionality
8. 📧 Update any email configurations if needed
9. 🚀 Announce go-live completion
```

---

## 🚨 EMERGENCY ROLLBACK PROCEDURE

### Immediate Rollback (2-5 minutes)
```bash
# If critical issues discovered:
1. 🔄 Revert DNS records to original values:
   tkafrokitchen.com A → 192.254.189.21
   
2. 🕐 Wait for DNS propagation (5-10 minutes)
   
3. ✅ WordPress site restored automatically
   
4. 📧 Notify stakeholders of rollback
```

### Automated Rollback Script
```bash
# Emergency rollback command (to be created):
./scripts/emergency-rollback.sh
# This will:
# - Revert DNS to original configuration
# - Send notification emails
# - Log rollback event
```

---

## 📁 BACKUP STORAGE LOCATIONS

### Required Backup Files
```bash
# Store in multiple locations:
1. 📥 Local storage: Download all backups locally
2. ☁️ Cloud storage: Upload to Google Drive/Dropbox
3. 📧 Email: Send backup confirmation to admin
4. 💾 External drive: Physical backup for critical data

# Backup naming convention:
tkafro_wordpress_db_2025-06-15_pre-migration.sql
tkafro_wordpress_files_2025-06-15_pre-migration.zip
tkafro_dns_config_2025-06-15_pre-migration.txt
```

### Backup Verification
```bash
# Verify backup integrity:
1. ✅ Check file sizes match source
2. ✅ Test database import on staging
3. ✅ Verify file extraction works
4. ✅ Confirm backup accessibility
```

---

## 📞 EMERGENCY CONTACTS

### Key Personnel
```bash
# During migration window:
- Technical Lead: [Contact info]
- Business Owner: [Contact info] 
- Hosting Support: HostGator/IONOS support
- DNS Support: Domain registrar support
```

### Support Resources
```bash
# Quick access links:
- HostGator/IONOS Control Panel: [URL]
- Domain Registrar: [URL]
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repository: https://github.com/olufemi2/tk-afro-kitchen
```

---

## ✅ FINAL GO/NO-GO CHECKLIST

### Pre-Migration Requirements
```bash
☐ WordPress backup completed and verified
☐ Files backup completed and verified  
☐ DNS configuration documented
☐ Staging site fully tested and approved
☐ Rollback procedure tested
☐ Emergency contacts notified
☐ Maintenance window scheduled
☐ All stakeholders informed
```

### Post-Migration Verification
```bash
☐ New site loads correctly
☐ All functionality working
☐ SSL certificate active
☐ Performance acceptable
☐ Search engines can access site
☐ Analytics tracking active
☐ Email notifications working
☐ No broken links or errors
```

---

## 📈 MONITORING & SUPPORT

### Post-Launch Monitoring (48 hours)
```bash
# Monitor closely:
- Site uptime and performance
- Error logs and issues
- User feedback and reports
- Search engine indexing
- Email delivery
- Payment processing
```

### Success Metrics
```bash
# Measure success by:
- Site load time < 3 seconds
- 99.9% uptime
- Zero payment failures
- Positive user feedback
- No SEO ranking drops
```

---

*This procedure ensures a safe, reversible migration with minimal business disruption.*