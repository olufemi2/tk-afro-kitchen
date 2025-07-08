# 🐛 Checkout Error Debugging Guide

## ✅ Backend Status (Verified)
- Payment API: **WORKING** ✅
- Stripe Configuration: **WORKING** ✅  
- Database: **WORKING** ✅
- Environment: **WORKING** ✅

## 🔍 Common Checkout Errors & Solutions

### **Error 1: "Card was declined"**
**Cause**: Wrong test card number
**Solution**: Use exactly `4242 4242 4242 4242`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/34`)
- Name: Any name

### **Error 2: "Payment failed" or "Something went wrong"**
**Cause**: Frontend/Backend communication issue
**Solution**: Check browser console for errors

### **Error 3: "Invalid payment method"**
**Cause**: Stripe keys mismatch or wrong mode
**Solution**: Verify test keys are being used

### **Error 4: Cart/checkout page not loading**
**Cause**: JavaScript errors or missing components
**Solution**: Check browser developer tools

## 🧪 Step-by-Step Debug Process

### **Step 1: Check Browser Console**
1. Open checkout page
2. Press `F12` (Developer Tools)
3. Go to **Console** tab
4. Look for red error messages
5. Take screenshot and share errors

### **Step 2: Check Network Tab**
1. In Developer Tools, go to **Network** tab
2. Try to complete payment
3. Look for failed requests (red entries)
4. Click on failed requests to see error details

### **Step 3: Test Payment API Directly**
Your payment API is working, but test again:
```bash
curl -X POST https://staging.tkafrokitchen.com/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 199,
    "currency": "gbp",
    "customer_details": {
      "name": "Test Customer",
      "email": "test@example.com"
    }
  }'
```

Should return:
```json
{
  "client_secret": "pi_...",
  "payment_intent_id": "pi_...",
  "customer_id": "cus_..."
}
```

### **Step 4: Check Stripe Dashboard**
1. Go to https://dashboard.stripe.com
2. Make sure you're in **Test Mode** (toggle top right)
3. Go to **Payments** section
4. Try the checkout process
5. Check if payment attempt appears (even if failed)

## 🎯 Quick Fixes for Common Issues

### **Issue: Test Card Not Working**
```
✅ Correct: 4242 4242 4242 4242
❌ Wrong: 42424242424242424242 (no spaces)
❌ Wrong: 4242424242424242 (missing digits)
```

### **Issue: Payment Modal/Form Issues**
Try these test cards for different scenarios:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`

### **Issue: CORS or Loading Errors**
Check if Stripe is loading properly:
```javascript
// In browser console, check if Stripe is loaded:
console.log(window.Stripe);
// Should return Stripe object, not undefined
```

## 🚨 Error Message Translation

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Your card was declined" | Wrong test card or using real card | Use `4242 4242 4242 4242` |
| "Network error" | API connection issue | Check internet, try again |
| "Invalid request" | Frontend sending wrong data | Check browser console |
| "Authentication required" | Stripe keys issue | Check environment variables |
| "Payment failed" | Generic error | Check Stripe dashboard logs |

## 🔄 Full Test Process

1. **Add item to cart**: https://staging.tkafrokitchen.com/menu
2. **Go to checkout**: Click checkout button
3. **Fill details**:
   - Name: Test Customer
   - Email: test@example.com
   - Phone: +44 123 456 7890
4. **Enter card details**:
   - Card: `4242 4242 4242 4242`
   - CVV: `123`
   - Expiry: `12/34`
5. **Submit payment**
6. **Check result**

## 📞 What to Check If Still Failing

1. **Share the exact error message** you're seeing
2. **Browser console errors** (screenshot helpful)
3. **Which browser** you're using
4. **What step** fails (cart, checkout form, payment submission)
5. **Check Stripe test dashboard** for payment attempts

## 💡 Immediate Actions

### **Right now, try this:**
1. Open: https://staging.tkafrokitchen.com/menu
2. Add any item to cart
3. Go to checkout
4. Enter the test card details exactly as shown above
5. If it fails, check browser console (F12) for error messages

### **If you see errors:**
- Red errors in console → Frontend issue
- Failed network requests → API issue  
- "Card declined" → Wrong card number
- No response → Stripe loading issue

Your backend is working perfectly, so the issue is likely in the frontend payment form or test card format!

## 🎯 Most Likely Fix

**The card number `42424242424242424242` is incorrect!**

✅ **Correct format**: `4242 4242 4242 4242` (with spaces)
✅ **Or**: `4242424242424242` (16 digits, no spaces)

❌ **Wrong**: `42424242424242424242` (20 digits - too many!)

Try the checkout again with the correct test card number!