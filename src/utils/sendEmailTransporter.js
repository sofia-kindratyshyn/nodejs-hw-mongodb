import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnv.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: getEnvVar('SMTP_USER') || 'sofiakind@ukr.net',
    pass: getEnvVar('SMTP_PASSWORD') || '3jGgN6sw5795GL55',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (jwtToken, email, user) => {
  try {
    const link = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${jwtToken}`;
    
    const mailOptions = {
      from: `"Sofia Kind" <${getEnvVar('SMTP_FROM') || 'sofiakind@ukr.net'}>`,
      to: email,
      subject: 'Password Reset Request',
      text: `Hello ${user.name},\n\nYou requested a password reset. Please click the link below or copy and paste it into your browser:\n\n${link}\n\nIf you didn't request this password reset, please ignore this email.\n\nBest regards,\nSofia Kind`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You requested a password reset. Please click the button below or copy and paste the link into your browser:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 14px;">
            <strong>Or copy this link:</strong><br>
            ${link}
          </p>
          <p><small style="color: #666;">If you didn't request this password reset, please ignore this email.</small></p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Best regards,<br>Sofia Kind</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email');
  }
};