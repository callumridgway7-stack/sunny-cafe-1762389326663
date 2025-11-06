import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Validate inputs
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Create transporter with SMTP placeholder (configure env vars in Vercel)
  // Example for Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=your-email@gmail.com, SMTP_PASS=your-app-password
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'placeholder@domain.com',
      pass: process.env.SMTP_PASS || 'placeholder-password',
    },
  });

  const mailOptions = {
    from: `${name} <${email}>`,
    to: 'hello@sunnycafe.com',
    subject: `Contact Form Submission from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}