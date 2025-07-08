# 💳 Stripe Live Payments & Bank Account Setup Guide

## 🚨 Current Status
You have **TEST keys** - these won't accept real payments!

## 📋 Steps to Accept Real Payments

### 1️⃣ **Complete Stripe Account Setup**

1. **Log into Stripe Dashboard**: https://dashboard.stripe.com
2. **Look for the activation banner** at the top
3. **Click "Complete your account"**

### 2️⃣ **Required Information**

Stripe will ask for:

**Business Information:**
- Business type (Individual/Company)
- Business address
- Tax ID/EIN (optional for individuals)
- Business website (use: https://staging.tkafrokitchen.com)

**Personal Information:**
- Your full legal name
- Date of birth
- Home address
- Last 4 digits of SSN (US) or equivalent

**Bank Account Details:**
- Bank name
- Account type (Checking/Savings)
- Routing number
- Account number

### 3️⃣ **Verification Process**

**Timeline:**
- Basic verification: 1-2 business days
- Full activation: 2-7 days
- First payout: 2-7 days after first payment

**What Stripe Verifies:**
- Your identity
- Business legitimacy
- Bank account ownership

### 4️⃣ **Get Your Live Keys**

Once approved:
1. Toggle to **Live Mode** (top right in Stripe)
2. Go to **Developers → API Keys**
3. Copy your live keys:
   - `pk_live_...` (Publishable)
   - `sk_live_...` (Secret)

### 5️⃣ **Update Vercel with Live Keys**

```
STRIPE_SECRET_KEY = sk_live_YOUR_LIVE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_LIVE_KEY
```

## 🏦 Bank Account Tips

**Recommended Banks:**
- Traditional: Chase, Bank of America, Wells Fargo
- Online: Mercury, Novo, Relay (business-friendly)
- Avoid: Some credit unions have issues

**Account Type:**
- Business checking (preferred)
- Personal checking (if sole proprietor)
- NOT savings accounts

## ⏱️ Timeline to Go Live

| Step | Time |
|------|------|
| Fill out Stripe form | 15-30 minutes |
| Identity verification | 1-2 days |
| Bank verification | 1-3 days |
| Live mode activated | 2-7 days total |
| First payout | 2-7 days after first sale |

## 🎯 Can You Accept Payments Now?

**Without Bank Account:**
- ❌ Cannot activate live mode
- ❌ Cannot accept real payments
- ✅ Can test everything in test mode

**With Bank Account:**
- ✅ Can activate live mode
- ✅ Accept real payments
- ✅ Automatic payouts to your bank

## 🚀 What to Do Right Now

### If You Have a Bank Account:
1. Go to https://dashboard.stripe.com
2. Complete the activation form
3. Wait for approval (check email)
4. Get live keys when approved
5. Update Vercel with live keys

### If You Don't Have a Bank Account:
1. **Option A**: Use personal checking account
2. **Option B**: Open business account (recommended)
   - Try Mercury (online, fast): https://mercury.com
   - Or local bank (bring business docs)
3. Then follow steps above

## 💡 Pro Tips

1. **Start activation now** - it takes days
2. **Use real information** - Stripe verifies everything
3. **Have documents ready**:
   - Driver's license
   - Bank statement
   - Business registration (if applicable)

4. **Test mode is perfect for now**:
   - Set everything up
   - Test full payment flow
   - Train staff
   - Ready to switch when approved

## ❓ Common Questions

**Q: Can I accept payments without a bank?**
A: No, Stripe requires a bank account for payouts.

**Q: How long until I get paid?**
A: First payout: 7-14 days. After that: 2-day rolling basis.

**Q: Can I use a friend's bank account?**
A: No, must be in your business name or your name.

**Q: What if I'm rejected?**
A: Stripe will explain why. Usually fixable (need more info, different account type, etc.)

## 🔄 Next Steps After Bank Setup

1. Complete Stripe activation
2. Get live API keys
3. Update Vercel environment
4. Test with small real payment
5. Go live! 🎉

Remember: Your site works perfectly in test mode. Use this time to perfect everything while Stripe reviews your account!