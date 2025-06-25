# Kitchen Notifications Setup Guide

## Overview
When a customer completes a payment, the system automatically sends notifications to kitchen staff via:
- ✅ **Email** with detailed order information
- ✅ **WhatsApp** with instant order alerts

## Email Setup (Gmail)

### 1. Create Gmail App Password
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to "Security" → "2-Step Verification" → "App passwords"
4. Generate app password for "Mail"
5. Use this password (not your regular Gmail password)

### 2. Update Environment Variables
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-kitchen-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

### 3. Configure Kitchen Staff Emails
Edit `/src/app/api/notify-kitchen/route.ts`:
```javascript
const KITCHEN_EMAILS = [
  'kitchen@tkafrokitchen.com',
  'chef@tkafrokitchen.com',
  'manager@tkafrokitchen.com',
];
```

## WhatsApp Setup (Twilio)

### 1. Create Twilio Account
1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token from Console
3. Set up WhatsApp Sandbox for testing
4. For production: Apply for WhatsApp Business API

### 2. Update Environment Variables
```bash
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
KITCHEN_WHATSAPP_1=whatsapp:+447123456789
KITCHEN_WHATSAPP_2=whatsapp:+447987654321
```

### 3. WhatsApp Sandbox Setup
1. In Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Join sandbox by sending "join <code>" to the sandbox number
3. Add kitchen staff phone numbers to sandbox
4. Format: `whatsapp:+447123456789` (include country code)

## Testing Notifications

### Test Email Only
```bash
# Set email variables, leave WhatsApp variables empty
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
# Leave TWILIO variables empty or commented out
```

### Test WhatsApp Only
```bash
# Set WhatsApp variables, leave email variables empty
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
# Leave SMTP variables empty or commented out
```

### Test Both
```bash
# Set all variables for full notification system
```

## Notification Content

### Email Includes:
- 🆔 Order ID and timestamp
- 👤 Customer details (name, phone, email, address)
- 🍽️ Complete order items with quantities and prices
- 💰 Total amount and payment method
- 📋 Action checklist for kitchen staff
- 🎨 Professional HTML formatting

### WhatsApp Includes:
- 🚨 NEW ORDER ALERT with emoji
- 📋 Order summary with key details
- 🍽️ Item list with quantities
- ⏰ Timestamp and request for confirmation

## Kitchen Staff Workflow

When order received:
1. **Email notification** arrives with full details
2. **WhatsApp alert** pings on mobile devices
3. Kitchen staff:
   - Confirm receipt
   - Check ingredient availability
   - Estimate preparation time
   - Contact customer if needed
   - Begin food preparation

## Production Recommendations

1. **Use dedicated kitchen email** (not personal Gmail)
2. **Set up WhatsApp Business API** for production (not sandbox)
3. **Add multiple staff members** for redundancy
4. **Test notifications daily** to ensure reliability
5. **Monitor failed notifications** in server logs

## Troubleshooting

### Email Not Working
- Check Gmail app password is correct
- Verify 2FA is enabled on Gmail account
- Check SMTP settings match exactly
- Look for "Less secure app access" if using old Gmail

### WhatsApp Not Working
- Verify Twilio credentials in Console
- Check phone numbers include country code
- Ensure numbers are joined to sandbox
- For production, verify WhatsApp Business API approval

### No Notifications
- Check environment variables are set
- Verify API endpoint `/api/notify-kitchen` is accessible
- Check server logs for error messages
- Test with minimal configuration first

## Cost Considerations

### Email (Gmail)
- ✅ **Free** for reasonable volumes
- No per-message charges

### WhatsApp (Twilio)
- 📱 **Sandbox: Free** for testing
- 💰 **Production: ~$0.005-0.02** per message
- 📊 Approximately **£0.01-0.05 per order notification**

## Support
For technical issues with notifications, check:
1. Environment variable configuration
2. Server logs in deployment platform
3. Twilio Console for WhatsApp delivery status
4. Gmail account security settings for email delivery