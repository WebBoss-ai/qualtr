// utils/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
    port: process.env.SMTP_PORT, // e.g., 587
    secure: process.env.SMTP_SECURE === 'false', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // your SMTP username
        pass: process.env.SMTP_PASS, // your SMTP password
    },
});

export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM, // sender address
        to: email, // list of receivers
        subject: 'Email Verification',
        html: `
            <h2>Email Verification</h2>
            <p>Please click the link below to verify your email:</p>
            <a href="${verificationLink}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};
