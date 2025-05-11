import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Configure your SMTP transporter (example uses Gmail SMTP)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // e.g. your Gmail address
        pass: process.env.EMAIL_PASS, // e.g. your Gmail app password
      },
    });

    // Compose the email
    await transporter.sendMail({
      from: `"TK Afro Kitchen" <${process.env.EMAIL_USER}>`,
      to: "info@tkafrokitchen.com",
      subject: "New Catering Quote Request",
      text: JSON.stringify(data, null, 2),
      html: `
        <h2>New Catering Quote Request</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}