import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
    port: process.env.SMTP_PORT, // e.g., 587
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // your SMTP username
        pass: process.env.SMTP_PASS, // your SMTP password
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error verifying SMTP connection:', error);
    } else {
        console.log('SMTP connection verified successfully');
    }
});

export const sendVerificationEmail = async (email, token) => {
    try {
        console.log('Sending verification email...');
        const verificationLink = `https://qualtr.com/verify-email?token=${token}`;
        console.log(`Verification Link: ${verificationLink}`);

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

        console.log('Mail options:', mailOptions);

        // Log transporter's configuration
        console.log('Transporter configuration:', transporter.options);

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};
