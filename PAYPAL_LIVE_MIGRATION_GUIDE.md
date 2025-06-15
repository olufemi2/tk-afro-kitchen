# PayPal Live Migration Guide
## TK Afro Kitchen - Production Payment Setup

### 🎯 **Overview**
This guide covers switching from PayPal Sandbox to PayPal Live environment with **remote hands-off deployment** options.

**Current Status**: ✅ Sandbox Environment (Testing)  
**Target Status**: 🎯 Live Environment (Production)

---

## 📋 **Pre-Migration Checklist**

### ✅ **Business Requirements**
- [ ] PayPal Business Account verified and approved
- [ ] Business bank account linked to PayPal
- [ ] Payment receiving limits removed/increased
- [ ] Business information complete in PayPal dashboard
- [ ] Tax information submitted (if required)

### ✅ **Technical Requirements**
- [ ] Current sandbox integration working correctly
- [ ] SSL certificate active on production domain
- [ ] Webhook endpoints configured and accessible
- [ ] Order management system ready
- [ ] Customer support process defined for payment issues

---

## 🔑 **Step 1: PayPal Business Account Setup**

### 1.1 Create PayPal Business Account
1. Go to [PayPal Business](https://www.paypal.com/uk/business)
2. Sign up with business email
3. Complete business verification process
4. Add business bank account
5. Verify bank account (micro-deposits)

### 1.2 Configure Business Settings
```
Business Type: Food & Beverage
Business Category: Restaurant/Food Service
Monthly Sales Volume: [Your estimated volume]
Website: https://tkafrokitchen.com
```

---

## 🔧 **Step 2: PayPal Developer Configuration**

### 2.1 Create Live App in PayPal Developer Dashboard
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Click "Create App"
3. **Important Settings**:
   ```
   App Name: TK Afro Kitchen Production
   Merchant: [Your Business Account]
   Environment: Live ⚠️ (NOT Sandbox)
   Features: Accept payments via PayPal
   ```

### 2.2 Get Live Credentials
After app creation, you'll receive:
```
Live Client ID: AXsomeliveclientidhere123...
Live Client Secret: EXsomeclientsecrethere456...
```

### 2.3 Configure Webhooks for Live Environment
1. In PayPal Developer Dashboard → Your App → Webhooks
2. Add webhook URL: `https://tkafrokitchen.com/api/webhooks/paypal`
3. **Required Events**:
   ```
   PAYMENT.CAPTURE.COMPLETED
   PAYMENT.CAPTURE.DENIED  
   CHECKOUT.ORDER.APPROVED
   CHECKOUT.ORDER.COMPLETED
   ```

---

## 🚀 **Step 3: Remote Hands-Off Deployment Options**

### Option A: Environment Variables Update (Recommended)
**✅ 100% Remote - No Code Changes Required**

#### 3.1 Vercel Dashboard Method
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your TK Afro Kitchen project
3. Go to Settings → Environment Variables
4. Update these variables:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=AXyourliveclientid123...
   PAYPAL_CLIENT_SECRET=EXyourclientsecret456...
   PAYPAL_WEBHOOK_ID=7ABC...your_webhook_id
   NODE_ENV=production
   ```
5. Redeploy: Settings → Functions → Redeploy

#### 3.2 Vercel CLI Method (If you have CLI access)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set production environment variables
vercel env add NEXT_PUBLIC_PAYPAL_CLIENT_ID production
# Enter your live client ID when prompted

vercel env add PAYPAL_CLIENT_SECRET production  
# Enter your live client secret when prompted

vercel env add PAYPAL_WEBHOOK_ID production
# Enter your webhook ID when prompted

# Deploy to production
vercel --prod
```

### Option B: GitHub Secrets Method
**✅ Also 100% Remote**

1. Go to your GitHub repository
2. Settings → Secrets and Variables → Actions
3. Add Repository Secrets:
   ```
   PAYPAL_LIVE_CLIENT_ID=AXyourliveclientid123...
   PAYPAL_LIVE_CLIENT_SECRET=EXyourclientsecret456...
   PAYPAL_LIVE_WEBHOOK_ID=7ABC...your_webhook_id
   ```

---

## 🔄 **Step 4: Automated Environment Switching**

I'll create an automated script that you can run remotely:

### 4.1 Environment Detection Script
The system will automatically:
- Detect if `NODE_ENV=production`
- Use live PayPal credentials in production
- Use sandbox credentials in development/staging
- Switch API endpoints automatically

### 4.2 No Code Changes Required
Your existing code will automatically:
- Switch from sandbox to live PayPal API
- Use production webhook endpoints
- Apply live payment processing

---

## 🧪 **Step 5: Testing & Validation**

### 5.1 Pre-Go-Live Testing Checklist
- [ ] Verify live credentials are set correctly
- [ ] Test small payment (£1) from your own card
- [ ] Verify webhook receipt and order processing
- [ ] Test payment failure scenarios
- [ ] Verify order confirmation emails
- [ ] Test both pickup and delivery orders

### 5.2 Go-Live Validation
```bash
# Use this URL to test your live PayPal integration
https://tkafrokitchen.com/checkout?test=live

# Check PayPal dashboard for test transactions
https://www.paypal.com/activity
```

---

## ⚠️ **Step 6: Critical Production Considerations**

### 6.1 Payment Limits
- **New PayPal accounts** may have receiving limits
- **Solution**: Contact PayPal to remove limits before go-live
- **Alternative**: Start with small transaction amounts

### 6.2 Fraud Protection
PayPal Live includes automatic fraud protection:
- Risk assessment on every transaction
- Some payments may be held for review
- Higher-risk transactions may be blocked

### 6.3 Dispute Management
- PayPal Seller Protection applies to eligible transactions
- Disputes handled through PayPal Resolution Center
- Keep detailed order records for dispute resolution

---

## 🔒 **Step 7: Security & Compliance**

### 7.1 PCI Compliance
✅ **Your setup is PCI compliant** because:
- PayPal handles all card processing
- No card data touches your servers
- PayPal is PCI DSS Level 1 certified

### 7.2 Data Protection
- Customer data encrypted in transit (HTTPS)
- PayPal handles sensitive payment data
- Order data stored securely in your system

---

## 📊 **Step 8: Monitoring & Analytics**

### 8.1 PayPal Reporting
- Transaction reports: PayPal Dashboard → Reports
- Settlement reports: Automatic bank transfers
- Monthly statements: Emailed automatically

### 8.2 Your Website Analytics
- Payment success rate monitoring
- Failed payment tracking
- Order completion funnel analysis

---

## 🚨 **Emergency Rollback Plan**

If issues arise after going live:

### Quick Rollback to Sandbox
1. Vercel Dashboard → Environment Variables
2. Change `NEXT_PUBLIC_PAYPAL_CLIENT_ID` back to sandbox ID
3. Redeploy (takes 2-3 minutes)

### Automatic Fallback
The system includes fallback handling:
- If live PayPal fails, shows "Payment system maintenance" message
- Customers can still place orders for manual processing
- No website downtime

---

## ✅ **Step 9: Remote Deployment Execution**

### 9.1 Hands-Off Deployment Timeline
```
T-0: Update environment variables in Vercel
T+2min: Auto-deployment completes
T+5min: PayPal live integration active
T+10min: Run validation tests
T+15min: Confirm successful go-live
```

### 9.2 Zero-Downtime Switch
- Environment variable updates are instant
- No code deployment required
- No customer-facing downtime
- Seamless transition from sandbox to live

---

## 📞 **Support & Troubleshooting**

### PayPal Support
- **Business Support**: 0800 358 9448 (UK)
- **Technical Issues**: PayPal Developer Community
- **Integration Help**: PayPal Developer Support

### Common Issues & Solutions
1. **"Client ID not found"** → Verify live credentials in environment variables
2. **"Payment declined"** → Check PayPal account limits and verification status
3. **"Webhook not received"** → Verify webhook URL is accessible and HTTPS

---

## 🎯 **Summary: Can It Be Done Remotely Hands-Off?**

### ✅ **YES - 100% Remote Deployment Possible**

**What you need to do remotely:**
1. Set up PayPal Business Account (online process)
2. Create Live App in PayPal Developer Dashboard (web interface)
3. Update environment variables in Vercel Dashboard (web interface)
4. Test the integration (online testing)

**No manual server access required**
**No code changes required**
**No technical team needed on-site**
**Deployment time: ~15 minutes**

**Total Remote Setup Time: 1-2 hours** (including PayPal account setup)

The migration can be completed entirely through web interfaces with immediate rollback capability if needed.