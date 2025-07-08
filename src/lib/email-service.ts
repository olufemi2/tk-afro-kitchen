import nodemailer from 'nodemailer';

// Validate email configuration
const validateEmailConfig = () => {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM_EMAIL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing email configuration:', missing);
    return false;
  }
  
  console.log('✅ Email configuration validated');
  return true;
};

const createTransporter = () => {
  if (!validateEmailConfig()) {
    console.warn('⚠️ Email configuration incomplete - email functionality will be disabled');
    return null;
  }
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Use false for port 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });
};

const transporter = createTransporter();

interface OrderNotification {
  orderId: string;
  customerEmail: string;
  customerName: string;
  amount: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
}

export async function sendOrderConfirmationEmail(notification: OrderNotification) {
  const { orderId, customerEmail, customerName, amount, status, items } = notification;

  console.log(`📧 Attempting to send customer confirmation email to: ${customerEmail}`);
  console.log(`📧 Order ID: ${orderId}, Amount: £${amount}`);

  if (!transporter) {
    console.warn('⚠️ Email service not configured - skipping customer confirmation email');
    return { messageId: 'NOT_CONFIGURED' };
  }

  if (!customerEmail || !customerEmail.includes('@')) {
    console.error('❌ Invalid customer email address:', customerEmail);
    throw new Error('Invalid customer email address');
  }

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #f97316;">Order Confirmation</h1>
      <p>Dear ${customerName},</p>
      <p>Thank you for your order at TK Afro Kitchen! We're excited to prepare your delicious meal.</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1e293b;">Order Details</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Total Amount:</strong> £${amount}</p>
        
        <h3 style="color: #1e293b;">Items Ordered:</h3>
        <ul style="list-style: none; padding: 0;">
          ${items.map(item => `
            <li style="margin-bottom: 10px;">
              ${item.name} x ${item.quantity} - £${item.price}
            </li>
          `).join('')}
        </ul>
      </div>

      <p>We'll notify you when your order is being prepared and when it's out for delivery.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b;">If you have any questions, please contact us at support@tkafrokitchen.com</p>
      </div>
    </div>
  `;

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: emailContent,
    });
    
    console.log(`✅ Customer confirmation email sent successfully to ${customerEmail}`);
    console.log('📧 Email result:', result.messageId);
    return result;
  } catch (error: any) {
    console.error(`❌ Failed to send customer confirmation email to ${customerEmail}:`, error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

export async function sendOrderStatusUpdateEmail(notification: OrderNotification) {
  const { orderId, customerEmail, customerName, status } = notification;

  console.log(`📧 Attempting to send status update email to: ${customerEmail}`);

  if (!transporter) {
    console.warn('⚠️ Email service not configured - skipping status update email');
    return { messageId: 'NOT_CONFIGURED' };
  }

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #f97316;">Order Status Update</h1>
      <p>Dear ${customerName},</p>
      <p>Your order status has been updated.</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1e293b;">Order Details</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>New Status:</strong> ${status}</p>
      </div>

      <p>We're working hard to get your order to you as soon as possible.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b;">If you have any questions, please contact us at support@tkafrokitchen.com</p>
      </div>
    </div>
  `;

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: customerEmail,
      subject: `Order Status Update - ${orderId}`,
      html: emailContent,
    });
    
    console.log(`✅ Status update email sent successfully to ${customerEmail}`);
    return result;
  } catch (error: any) {
    console.error(`❌ Failed to send status update email to ${customerEmail}:`, error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

export async function sendPaymentFailedEmail(notification: OrderNotification) {
  const { orderId, customerEmail, customerName } = notification;

  console.log(`📧 Attempting to send payment failed email to: ${customerEmail}`);

  if (!transporter) {
    console.warn('⚠️ Email service not configured - skipping payment failed email');
    return { messageId: 'NOT_CONFIGURED' };
  }

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ef4444;">Payment Failed</h1>
      <p>Dear ${customerName},</p>
      <p>We were unable to process your payment for order ${orderId}.</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>Please try placing your order again or contact your payment provider for assistance.</p>
      </div>

      <p>If you need help, our support team is here to assist you.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b;">Contact us at support@tkafrokitchen.com</p>
      </div>
    </div>
  `;

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: customerEmail,
      subject: `Payment Failed - Order ${orderId}`,
      html: emailContent,
    });
    
    console.log(`✅ Payment failed email sent successfully to ${customerEmail}`);
    return result;
  } catch (error: any) {
    console.error(`❌ Failed to send payment failed email to ${customerEmail}:`, error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

export async function sendKitchenNotificationEmail(notification: OrderNotification) {
  const { orderId, customerName, amount, items } = notification;

  console.log(`📧 Attempting to send kitchen notification email for order: ${orderId}`);

  if (!transporter) {
    console.warn('⚠️ Email service not configured - skipping kitchen notification email');
    return { messageId: 'NOT_CONFIGURED' };
  }

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #f97316;">New Order Received!</h1>
      <p>A new order has been placed on TK Afro Kitchen.</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1e293b;">Order Details</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Total Amount:</strong> £${amount}</p>
        
        <h3 style="color: #1e293b;">Items Ordered:</h3>
        <ul style="list-style: none; padding: 0;">
          ${items.map(item => `
            <li style="margin-bottom: 10px;">
              ${item.name} x ${item.quantity} - £${item.price}
            </li>
          `).join('')}
        </ul>
      </div>

      <p>Please prepare this order for dispatch.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b;">This is an automated notification. Do not reply.</p>
      </div>
    </div>
  `;

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.KITCHEN_EMAIL,
      subject: `New Order #${orderId} - TK Afro Kitchen`,
      html: emailContent,
    });
    
    console.log(`✅ Kitchen notification email sent successfully for order ${orderId}`);
    return result;
  } catch (error: any) {
    console.error(`❌ Failed to send kitchen notification email for order ${orderId}:`, error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}