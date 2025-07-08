# 🚀 TK Afro Kitchen - Live Stripe Payment Setup Guide

## ✅ Prerequisites
- Stripe account with business verification completed
- Access to Vercel dashboard
- Live deployment URL

## 📋 Step-by-Step Setup

### 1️⃣ **Initialize Database** (if not done already)
```bash
curl -X POST https://your-vercel-url.vercel.app/api/admin/init-db
```

### 2️⃣ **Configure Stripe Live Environment**

#### A. Required Environment Variables in Vercel:
```
STRIPE_SECRET_KEY = sk_live_YOUR_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET = whsec_YOUR_WEBHOOK_SECRET
NEXT_PUBLIC_SITE_URL = https://your-vercel-url.vercel.app
```

#### B. Optional but Recommended:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID = (your PayPal client ID)
PAYPAL_SECRET = (your PayPal secret)
```

### 3️⃣ **Test Live Payments**

1. **Visit your site**: `https://your-vercel-url.vercel.app`
2. **Add items to cart**
3. **Go to checkout**
4. **Use a real card** (Stripe will process it)

#### Test Card Numbers (for initial testing):
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- **Note**: In live mode, these won't work - use a real card

### 4️⃣ **Verify Everything Works**

#### Check Payment Processing:
```bash
curl https://your-vercel-url.vercel.app/api/health
```
Should show: `"hasStripeKey": true`

#### Check Menu Items:
```bash
curl https://your-vercel-url.vercel.app/api/debug/menu
```
Should show: `"menuItemsCount": 43`

### 5️⃣ **Monitor Live Payments**

1. **Stripe Dashboard**: https://dashboard.stripe.com/payments
2. **Vercel Logs**: Check function logs for any errors
3. **Customer Emails**: Ensure order confirmations are sent

## 🔒 Security Checklist

- [ ] Never commit live keys to Git
- [ ] Use environment variables only
- [ ] Enable Stripe webhook signature verification
- [ ] Set up fraud protection rules in Stripe
- [ ] Enable 3D Secure for European cards

## 🚨 Troubleshooting

### Payment Fails
1. Check Vercel function logs
2. Verify all environment variables are set
3. Check Stripe Dashboard for declined reasons

### Webhook Not Working
1. Verify endpoint URL is correct
2. Check webhook signing secret
3. Look at Stripe webhook logs

### Database Issues
1. Run debug endpoint to check connection
2. Re-initialize if needed
3. Check Vercel Postgres is active

## 📞 Going Live Checklist

- [ ] All environment variables set in Vercel
- [ ] Database initialized with menu items
- [ ] Test order placed successfully
- [ ] Email notifications working
- [ ] Webhook processing confirmed
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Payment methods enabled in Stripe
- [ ] Business details complete in Stripe

## 💡 Pro Tips

1. **Start with small amounts** to test the flow
2. **Monitor first few orders** closely
3. **Set up Stripe Radar** for fraud protection
4. **Enable customer receipts** in Stripe
5. **Test on mobile devices** too

## 🎉 You're Ready!

Once all steps are complete, your customers can make real payments on your site!