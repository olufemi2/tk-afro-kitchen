# Email Configuration Guide for TK Afro Kitchen

## Issue Identified
The email functionality is not working because the SMTP configuration is missing from the environment variables.

## Required Environment Variables

Add the following to your `.env.local` file:

```bash
# SMTP Configuration (Example using Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM_EMAIL="TK Afro Kitchen <orders@tkafrokitchen.com>"

# Kitchen Email (where kitchen notifications are sent)
KITCHEN_EMAIL=kitchen@tkafrokitchen.com

# Optional: Twilio for WhatsApp notifications
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
KITCHEN_WHATSAPP_1=whatsapp:+447123456789
KITCHEN_WHATSAPP_2=whatsapp:+447987654321
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App-Specific Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Generate a 16-character password
   - Use this password for `SMTP_PASSWORD`

## Other Email Providers

### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
```

### Amazon SES
```bash
SMTP_HOST=email-smtp.eu-west-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

## What Was Fixed

1. **Added customer email sending** to the `/api/notify-kitchen` endpoint
2. **Fixed the Stripe webhook** import issue (though this webhook is not currently being used for the main checkout flow)
3. The checkout flow now sends both:
   - Customer confirmation email
   - Kitchen notification email
   - Optional WhatsApp notification

## Testing the Email Flow

1. Add the SMTP configuration to `.env.local`
2. Restart your development server
3. Make a test purchase
4. Check the console logs for:
   - "✅ Customer confirmation email sent"
   - "✅ Email sent to kitchen@tkafrokitchen.com"

## Current Email Flow

1. Customer completes checkout
2. Payment is processed (Stripe/PayPal)
3. `/api/notify-kitchen` is called with order data
4. Three notifications are sent:
   - Customer confirmation email (using email-service.ts)
   - Kitchen email notification
   - Kitchen WhatsApp (if configured)

## Troubleshooting

If emails are still not sending:

1. **Check SMTP credentials** - Ensure they're correct
2. **Check firewall/port blocking** - Port 587 must be open
3. **Enable "Less secure app access"** if using personal Gmail (not recommended for production)
4. **Check Vercel logs** for any error messages
5. **Verify email addresses** - Some SMTP providers require verified sender addresses

## Production Recommendations

1. Use a transactional email service (SendGrid, Mailgun, Amazon SES)
2. Set up proper SPF, DKIM, and DMARC records
3. Monitor email delivery rates
4. Implement retry logic for failed emails
5. Store email logs for debugging