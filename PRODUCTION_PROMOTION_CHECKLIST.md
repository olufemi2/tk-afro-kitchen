# 🚀 Production Promotion Checklist - TK Afro Kitchen

**Migration:** WordPress (IONOS) → Next.js (Vercel)  
**Strategy:** Promote staging.tkafrokitchen.com to tkafrokitchen.com  
**Date:** [TO BE FILLED]  
**Executed By:** [TO BE FILLED]

---

## 📋 PRE-PROMOTION CHECKLIST

### 🛡️ Critical Backups (MANDATORY)
```bash
☐ WordPress database backup completed
☐ WordPress files backup completed  
☐ WooCommerce data exported (orders, customers, products)
☐ Current DNS configuration documented
☐ SSL certificate details recorded
☐ Email configuration verified and documented
☐ All backups tested and verified accessible
☐ Backup locations documented (local + cloud)
```

### 🧪 Staging Verification (MANDATORY)
```bash
☐ Run staging verification script: ./scripts/staging-verification.sh
☐ All critical tests passing (0 failures)
☐ Manual functional testing completed:
  ☐ Homepage loads correctly
  ☐ Menu displays all items with pricing
  ☐ Cart functionality works (add/remove items)
  ☐ Checkout process complete:
    ☐ Pickup option (free) available
    ☐ Nationwide delivery option (£27.99) available
    ☐ Address fields conditional (only for delivery)
    ☐ No estimated delivery times shown
  ☐ PayPal payment integration functional
  ☐ Order confirmation page works
  ☐ Mobile responsiveness verified
  ☐ Performance acceptable (< 5 second load times)
```

### 📧 Email & Business Continuity
```bash
☐ Email services verified working (IONOS mail)
☐ Email will remain unaffected (MX records unchanged)
☐ Business contact forms tested on staging
☐ Order notification emails configured
☐ Admin notification emails configured
```

### 👥 Stakeholder Communication
```bash
☐ Business owner notified of migration timeline
☐ Staff trained on new system (if applicable)
☐ Customers notified of potential brief interruption
☐ Support team briefed on new site features
☐ Emergency contact list prepared
```

---

## ⏰ MIGRATION TIMING

### Recommended Window
```bash
Optimal Time: [Low traffic period - typically early morning]
Estimated Duration: 30-60 minutes total
Rollback Window: 5-10 minutes if needed
Complete Propagation: Up to 24 hours globally
```

### Timeline Breakdown
```bash
00:00 - Start migration process
00:05 - Final WordPress backup
00:10 - Lower DNS TTL (prepare for quick changes)  
00:15 - Update DNS to point to Vercel
00:20 - Monitor initial DNS propagation
00:30 - Test new site functionality
00:45 - Verify email services working
01:00 - Complete migration (if successful)
```

---

## 🔄 MIGRATION EXECUTION STEPS

### Phase 1: Final Preparation (15 minutes)
```bash
☐ 1.1 Execute final WordPress backup
    Command: [Manual via cPanel/phpMyAdmin]
    Verify: Backup file size and accessibility

☐ 1.2 Lower DNS TTL for quick rollback capability
    Change: TTL from 3600 to 300 seconds (5 minutes)
    Wait: 5 minutes for TTL change to propagate

☐ 1.3 Put WordPress site in maintenance mode (optional)
    Purpose: Prevent new orders during migration
    Method: [Via WordPress maintenance plugin]

☐ 1.4 Final staging verification
    Command: ./scripts/staging-verification.sh
    Required: All tests must pass (0 failures)
```

### Phase 2: DNS Cutover (10 minutes)
```bash
☐ 2.1 Access IONOS DNS control panel
    URL: https://my.ionos.com
    Navigate: Domain management → DNS settings

☐ 2.2 Update A record for tkafrokitchen.com
    BEFORE: A record → 192.254.189.21
    AFTER:  CNAME → cname.vercel-dns.com
    TTL: 300 seconds (5 minutes)

☐ 2.3 Update www subdomain (if applicable)
    BEFORE: www CNAME → tkafrokitchen.com  
    AFTER:  www CNAME → cname.vercel-dns.com
    TTL: 300 seconds

☐ 2.4 Save DNS changes
    Confirm: Changes saved successfully
    Note: Propagation begins immediately
```

### Phase 3: Verification & Monitoring (30 minutes)
```bash
☐ 3.1 Monitor DNS propagation
    Command: ./scripts/monitor_rollback.sh (adapted for forward migration)
    Tool: whatsmydns.net for global verification
    Expected: 5-15 minutes for initial propagation

☐ 3.2 Test new site functionality
    URL: https://tkafrokitchen.com
    Tests:
    ☐ Homepage loads
    ☐ Menu page functional
    ☐ Checkout process complete
    ☐ Payment integration working
    ☐ SSL certificate valid

☐ 3.3 Verify email services unaffected
    Test: Send test email to admin
    Verify: Email delivery working normally
    Confirm: MX records unchanged

☐ 3.4 Performance verification
    Test: Page load speeds
    Target: < 5 seconds for main pages
    Monitor: No errors in browser console
```

---

## 🚨 ROLLBACK PROCEDURE

### Immediate Rollback Triggers
```bash
❌ New site not loading after 15 minutes
❌ Payment processing failures
❌ Critical functionality broken
❌ SSL certificate issues
❌ Email services disrupted
```

### Emergency Rollback Steps
```bash
☐ Execute rollback script
    Command: ./scripts/emergency-rollback.sh "Reason for rollback"
    
☐ Manual DNS revert (if script fails)
    Login: IONOS control panel
    Change: A record back to 192.254.189.21
    TTL: 300 seconds (quick restore)
    
☐ Verify WordPress site restored
    Command: /tmp/verify_rollback.sh
    Test: WordPress admin access
    Confirm: WooCommerce functional
    
☐ Notify stakeholders of rollback
    Message: Include reason and next steps
    Timeline: Provide revised migration schedule
```

---

## ✅ POST-MIGRATION VERIFICATION

### Immediate Verification (0-2 hours)
```bash
☐ Site accessibility from multiple locations
☐ All critical functionality working
☐ SSL certificate valid and secure
☐ Payment processing functional
☐ Email services operational
☐ No broken links or missing images
☐ Mobile responsiveness confirmed
☐ Performance within acceptable limits
```

### 24-Hour Monitoring
```bash
☐ DNS fully propagated globally
☐ Search engine accessibility verified
☐ Analytics tracking functional
☐ No error reports from users
☐ Email delivery rates normal
☐ Payment success rates normal
☐ Site performance stable
```

### 48-Hour Confirmation
```bash
☐ All functionality confirmed stable
☐ User feedback collected and positive
☐ No SEO ranking impacts detected
☐ Business operations normal
☐ Technical issues resolved (if any)
☐ Restore normal DNS TTL (3600 seconds)
```

---

## 📊 SUCCESS METRICS

### Technical Metrics
```bash
Target Metrics:
- Site uptime: 99.9%
- Page load time: < 3 seconds
- Payment success rate: 100%
- Email delivery rate: 100%
- Error rate: < 0.1%
```

### Business Metrics
```bash
- No loss of orders during migration
- Customer satisfaction maintained
- Staff adaptation successful
- Business operations uninterrupted
```

---

## 🎯 FINAL GO/NO-GO DECISION

### GO Criteria (All must be ✅)
```bash
☐ All backups completed and verified
☐ Staging verification script passes (0 failures)
☐ Stakeholders informed and ready
☐ Emergency rollback procedure tested
☐ Support team briefed and available
☐ Migration window optimal (low traffic)
☐ Technical team available for monitoring
```

### NO-GO Criteria (Any ❌ = STOP)
```bash
❌ Backup verification fails
❌ Staging verification fails
❌ Critical functionality broken on staging
❌ Key stakeholders unavailable
❌ High traffic period
❌ Recent issues with hosting providers
❌ Team unavailable for monitoring
```

---

## 📞 EMERGENCY CONTACTS

### Technical Support
```bash
- Primary Technical Lead: [Name, Phone, Email]
- Backup Technical Lead: [Name, Phone, Email]
- IONOS Support: [Phone, Account details]
- Vercel Support: [Email, Account details]
```

### Business Contacts
```bash
- Business Owner: [Name, Phone, Email]
- Operations Manager: [Name, Phone, Email]
- Customer Service: [Name, Phone, Email]
```

### Vendor Support
```bash
- Domain Registrar: [Support contact]
- SSL Provider: [Support contact]
- PayPal Integration: [Technical support]
```

---

## 📝 MIGRATION LOG TEMPLATE

```bash
Migration Date: [DATE]
Start Time: [TIME]
End Time: [TIME]
Executed By: [NAME]

Checkpoints:
[ ] Pre-migration checklist completed
[ ] Backups verified
[ ] DNS TTL lowered
[ ] DNS updated
[ ] Initial verification passed
[ ] Full propagation confirmed
[ ] Migration declared successful

Issues Encountered:
- [LIST ANY ISSUES]

Rollback Executed: [YES/NO]
Rollback Reason: [IF APPLICABLE]

Final Status: [SUCCESS/ROLLBACK/PARTIAL]
Next Steps: [IMMEDIATE ACTIONS NEEDED]

Notes:
[ADDITIONAL OBSERVATIONS]
```

---

**⚠️ REMEMBER:**
- **Email services remain on IONOS** (unaffected by migration)
- **Rollback window is 5-10 minutes** via DNS change
- **Full WordPress backup available** for complete restoration
- **Staging site proves new system works** correctly

*This checklist ensures a safe, monitored, and reversible migration to production.*