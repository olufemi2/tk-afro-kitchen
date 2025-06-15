# TK Afro Kitchen - Complete Deployment Guide

## 🚀 Production Deployment Checklist

### Phase 1: Pre-Deployment Setup

#### PayPal Configuration (CRITICAL)
1. **Create PayPal Developer Account**
   - Visit: https://developer.paypal.com/
   - Create sandbox and live applications
   - Note down Client IDs and Client Secrets

2. **Generate Access Token**
   ```bash
   curl -v https://api-m.paypal.com/v1/oauth2/token \
     -H "Accept: application/json" \
     -H "Accept-Language: en_US" \
     -u "client_id:client_secret" \
     -d "grant_type=client_credentials"
   ```

3. **Create Webhook**
   - In PayPal Dashboard: Apps & Credentials > Your App > Webhooks
   - URL: `https://yourdomain.com/api/webhooks/paypal`
   - Events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, `PAYMENT.CAPTURE.REFUNDED`

#### Required Environment Variables
Copy from `.env.example` and configure in Vercel:

**Essential (Required for payments):**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_ACCESS_TOKEN=your_access_token
PAYPAL_WEBHOOK_ID=your_webhook_id
NODE_ENV=production
```

**Optional (Future enhancements):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Phase 2: Vercel Deployment

#### Step 1: Repository Connection
1. **Connect to Vercel**
   - Import from GitHub/GitLab
   - Framework: Next.js
   - Root Directory: `tk-afro-kitchen`

#### Step 2: Environment Variables Setup
1. **Vercel Dashboard**
   - Project Settings > Environment Variables
   - Add ALL required variables
   - Set for: Production, Preview, Development

#### Step 3: Build Configuration
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x

#### Step 4: Domain Setup
1. **Custom Domain** (if applicable)
   - Project Settings > Domains
   - Add your domain
   - Configure DNS records as shown

### Phase 3: Post-Deployment Verification

#### Immediate Testing (CRITICAL)
- [ ] **Homepage loads correctly**
- [ ] **Menu pages display all items**
- [ ] **Cart functionality works**
- [ ] **Checkout page loads PayPal buttons**
- [ ] **Test payment in sandbox mode**
- [ ] **Webhook endpoint responds (check Vercel logs)**

#### PayPal Integration Testing
1. **Sandbox Testing**
   - Use PayPal test accounts
   - Complete full payment flow
   - Verify webhook receives events
   - Check Vercel function logs

2. **Switch to Production**
   - Update environment variables to live PayPal credentials
   - Test with real payment (small amount)
   - Verify production webhook

#### Performance Checks
- [ ] **Page load speeds < 3 seconds**
- [ ] **Mobile responsiveness**
- [ ] **All images load correctly**
- [ ] **No console errors**

### Phase 4: Go-Live Preparation

#### Final Checklist
- [ ] **All payments processing correctly**
- [ ] **Order confirmation flow working**
- [ ] **Customer email notifications (if configured)**
- [ ] **Menu items and pricing accurate**
- [ ] **Contact information updated**
- [ ] **Terms of service/privacy policy**

#### Monitoring Setup
1. **Vercel Analytics**
   - Enable in project settings
   - Monitor performance metrics

2. **Error Tracking**
   - Check Vercel function logs regularly
   - Set up alerts for webhook failures

#### Customer Communication
- [ ] **Announce launch to customers**
- [ ] **Update social media/marketing materials**
- [ ] **Prepare customer support for orders**

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18.18.0+
- npm or yarn

### Setup Steps
1. **Clone and Install**
   ```bash
   git clone <repository>
   cd tk-afro-kitchen
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Start Development**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

## 🔧 Troubleshooting

### Common Issues
1. **PayPal buttons not loading**
   - Check NEXT_PUBLIC_PAYPAL_CLIENT_ID is set
   - Verify client ID matches PayPal dashboard

2. **Webhook verification fails**
   - Ensure PAYPAL_WEBHOOK_ID matches PayPal dashboard
   - Check PAYPAL_ACCESS_TOKEN is valid

3. **Build failures**
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all environment variables are set

### Support Resources
- PayPal Developer Documentation
- Vercel Documentation
- Next.js Documentation

---

## 📋 Environment Variables Reference

See `.env.example` for complete list with descriptions.