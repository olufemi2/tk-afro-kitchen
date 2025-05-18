import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

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

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: customerEmail,
    subject: `Order Confirmation - ${orderId}`,
    html: emailContent,
  });
}

export async function sendOrderStatusUpdateEmail(notification: OrderNotification) {
  const { orderId, customerEmail, customerName, status } = notification;

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

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: customerEmail,
    subject: `Order Status Update - ${orderId}`,
    html: emailContent,
  });
}

export async function sendPaymentFailedEmail(notification: OrderNotification) {
  const { orderId, customerEmail, customerName } = notification;

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

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: customerEmail,
    subject: `Payment Failed - Order ${orderId}`,
    html: emailContent,
  });
} 