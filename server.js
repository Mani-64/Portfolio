// ==========================================================================
// PORTFOLIO BACKEND — Express + Nodemailer (Gmail SMTP)
// ==========================================================================
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the portfolio static files
app.use(express.static(path.join(__dirname, 'portfolio')));

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP connection failed:', error.message);
    } else {
        console.log('✅ SMTP connected — ready to send emails');
    }
});

// ==========================================================================
// POST /api/contact — Receives form data, sends email via Gmail
// ==========================================================================
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.',
        });
    }

    // Email content
    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_TO,
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: linear-gradient(135deg, #4f46e5, #0891b2); padding: 24px 32px;">
                    <h2 style="margin: 0; color: #ffffff; font-size: 20px;">📬 New Portfolio Message</h2>
                </div>
                <div style="padding: 32px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600; width: 100px;">Name</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Email</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #4f46e5;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Subject</td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${subject}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 24px;">
                        <p style="color: #64748b; font-weight: 600; margin-bottom: 8px;">Message</p>
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</div>
                    </div>
                </div>
                <div style="background: #f1f5f9; padding: 16px 32px; text-align: center;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">Sent from Mani Teja Gurram's Portfolio</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent — From: ${name} <${email}> | Subject: ${subject}`);
        res.json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.',
        });
    } catch (error) {
        console.error('❌ Email send failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
        });
    }
});

// Fallback — serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running at http://localhost:${PORT}`);
});
