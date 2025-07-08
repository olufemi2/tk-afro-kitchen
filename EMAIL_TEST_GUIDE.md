# 📧 Email Notification Testing Guide

## 🔍 Current Email Setup Status

Your site has **2 email systems**:

1. **Customer Emails** (`/lib/email-service.ts`)
   - Order confirmations
   - Status updates 
   - Payment failures

2. **Kitchen Notifications** (`/api/notify-kitchen`)
   - New order alerts to staff
   - Detailed order information
   - WhatsApp notifications (optional)

## ⚙️ Required Environment Variables

Add these to your **Vercel Environment Variables**:

```
# SMTP Configuration
SMTP_HOST = smtp.gmail.com (or your email provider)
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASSWORD = your-app-password
SMTP_FROM_EMAIL = orders@tkafrokitchen.com

# Kitchen Staff Emails  
KITCHEN_EMAIL_1 = kitchen@tkafrokitchen.com
KITCHEN_EMAIL_2 = chef@tkafrokitchen.com

# Optional: WhatsApp via Twilio
TWILIO_ACCOUNT_SID = (optional)
TWILIO_AUTH_TOKEN = (optional)
TWILIO_WHATSAPP_FROM = (optional)
```

## 🧪 How to Test Email Notifications

### **Test 1: Check Current Configuration**
```bash
curl https://staging.tkafrokitchen.com/api/health
```
Look for email-related settings in the response.

### **Test 2: Test Kitchen Notification**
```bash
curl -X POST https://staging.tkafrokitchen.com/api/notify-kitchen \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-001",
    "amount": "25.99",
    "finalTotal": "25.99",
    "paymentMethod": "card",
    "fulfillmentType": "collection",
    "totalAmount": "25.99",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
    "customerInfo": {
      "fullName": "Test Customer",
      "email": "test@example.com",
      "phone": "+44 123 456 7890"
    },
    "items": [
      {
        "name": "Jollof Rice",
        "quantity": 1,
        "price": 25.99,
        "selectedSize": {
          "size": "Regular"
        }
      }
    ]
  }'
```

Expected response:
```json
{
  "success": true,
  "notifications": {
    "email": true,
    "whatsapp": false
  }
}
```

### **Test 3: End-to-End Order Test**
1. Visit: https://staging.tkafrokitchen.com/menu
2. Add items to cart
3. Go to checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete order
6. Check if kitchen receives email

## 📋 Email Setup Options

### **Option 1: Gmail (Easiest)**
1. Use your Gmail account
2. Enable 2-factor authentication
3. Generate an "App Password" for the site
4. Use these settings:
   ```
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = your-gmail@gmail.com
   SMTP_PASSWORD = your-16-digit-app-password
   ```

### **Option 2: Professional Email**
Use your domain email (e.g., orders@tkafrokitchen.com):
1. Get SMTP settings from your hosting provider
2. Usually similar format to Gmail

### **Option 3: SendGrid/Mailgun (Recommended for Production)**
- More reliable for transactional emails
- Better deliverability
- Professional appearance

## 🚨 Troubleshooting

### **No Emails Received?**

1. **Check Environment Variables**
   ```bash
   curl https://staging.tkafrokitchen.com/api/health
   ```

2. **Check Vercel Function Logs**
   - Go to Vercel Dashboard
   - Click on your project
   - Go to "Functions" tab
   - Look for error logs

3. **Test SMTP Connection**
   Run the kitchen notification test above and check response

4. **Check Spam Folder**
   - Gmail sometimes flags automated emails
   - Check spam/junk folders

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Check SMTP password/app password |
| "Connection timeout" | Verify SMTP_HOST and SMTP_PORT |
| "Sender not allowed" | Set SMTP_FROM_EMAIL properly |
| "No response" | Check environment variables are set |

## ✅ Email Test Checklist

- [ ] Environment variables set in Vercel
- [ ] Kitchen notification test returns `"email": true`
- [ ] Test order triggers kitchen email
- [ ] Email appears professional (not spam)
- [ ] All order details included correctly
- [ ] Customer email works (if configured)

## 💡 Quick Fixes

### **If emails aren't working:**

1. **Add environment variables** in Vercel
2. **Use Gmail app password** for testing
3. **Check kitchen email addresses** are correct
4. **Test with the curl command** above

### **If you need immediate testing:**
```bash
# Replace YOUR_EMAIL with your actual email
curl -X POST https://staging.tkafrokitchen.com/api/notify-kitchen \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "EMAIL-TEST-'$(date +%s)'",
    "amount": "1.00",
    "finalTotal": "1.00",
    "paymentMethod": "test",
    "fulfillmentType": "collection",
    "totalAmount": "1.00",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
    "customerInfo": {
      "fullName": "Email Test",
      "email": "YOUR_EMAIL@example.com",
      "phone": "+44 123 456 7890"
    },
    "items": [
      {
        "name": "Test Item",
        "quantity": 1,
        "price": 1.00,
        "selectedSize": {"size": "Test"}
      }
    ]
  }'
```

This will test if the notification system can send emails to kitchen staff!