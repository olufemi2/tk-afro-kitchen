# 🌐 Domain Migration Guide for TK Afro Kitchen

## ✅ The Good News
Your site works on **BOTH** domains simultaneously:
- `tk-afro-kitchen.vercel.app` (current)
- `www.yourdomain.com` (future)

No need to migrate data or change code!

## 📋 Steps to Add Your Custom Domain

### 1️⃣ **In Vercel Dashboard**
1. Go to your project settings
2. Click "Domains"
3. Add your domain (e.g., `tkafrokitchen.com`)
4. Follow Vercel's DNS instructions

### 2️⃣ **Update Environment Variables**
Add/Update in Vercel settings:
```
NEXT_PUBLIC_SITE_URL = https://www.tkafrokitchen.com
```

### 3️⃣ **Update Stripe Webhooks**
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add new endpoint: `https://www.tkafrokitchen.com/api/webhooks/stripe`
3. Copy the new webhook secret
4. Update in Vercel: `STRIPE_WEBHOOK_SECRET = whsec_NEW_SECRET`

**Pro Tip**: Keep both webhooks active during transition!

### 4️⃣ **Update PayPal (if using)**
1. Go to PayPal Developer Dashboard
2. Update redirect URLs to include new domain
3. Add: `https://www.tkafrokitchen.com/success`

## 🔄 What Happens During Migration

### Automatic (No Action Needed):
- ✅ Database connections
- ✅ User sessions
- ✅ API functionality
- ✅ Static assets (images, etc.)
- ✅ SSL certificates (Vercel provides)

### Manual Updates Required:
- 📝 Stripe webhook URL
- 📝 NEXT_PUBLIC_SITE_URL environment variable
- 📝 PayPal redirect URLs (if applicable)
- 📝 Google Analytics (if set up)
- 📝 Email sender domain (if using custom emails)

## 🚀 Migration Timeline

**Day 1: Add Domain**
- Add domain in Vercel
- Update DNS records
- Wait for propagation (5 mins - 48 hours)

**Day 2: Update Services**
- Update Stripe webhooks
- Update environment variables
- Test payments on new domain

**Day 3: Full Cutover**
- Redirect old URLs if needed
- Update marketing materials
- Monitor both domains

## ✨ Best Practices

1. **Keep Both Domains Active** during transition
2. **Test Everything** on new domain before announcing
3. **Update Email Templates** with new domain
4. **Set Up Redirects** from old to new (optional)

## 📝 Pre-Launch Checklist

Before announcing new domain:
- [ ] Domain resolves correctly
- [ ] SSL certificate active (automatic)
- [ ] Menu loads properly
- [ ] Can add items to cart
- [ ] Checkout process works
- [ ] Payment succeeds
- [ ] Order confirmation received
- [ ] Stripe webhook triggers
- [ ] Admin panel accessible

## 🆘 Troubleshooting

### Domain Not Working?
- Check DNS propagation: https://dnschecker.org
- Verify in Vercel domains tab
- Wait up to 48 hours for global propagation

### Payments Failing on New Domain?
- Check `NEXT_PUBLIC_SITE_URL` is updated
- Verify Stripe webhook is added for new domain
- Check browser console for errors

### SSL Certificate Issues?
- Vercel provides automatic SSL
- If issues, remove and re-add domain
- Contact Vercel support if persists

## 🎉 Migration Complete!

Once everything is verified, you can:
1. Start marketing with new domain
2. Update business cards/materials
3. Set up email at new domain (optional)
4. Consider redirecting Vercel URL to custom domain

Remember: **Both domains continue to work**, so there's no rush or downtime!