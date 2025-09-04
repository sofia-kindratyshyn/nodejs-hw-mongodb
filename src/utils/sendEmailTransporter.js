import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnv.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: 'sofiakind@ukr.net',
    pass: '3jGgN6sw5795GL55',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (jwtToken, email, user) => {
  try {
    const link = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${jwtToken}`;
    return await transporter.sendMail({
      from: `"Sofia Kind" <${getEnvVar('SMTP_FROM')}>`,
      to: `${email}`,
      subject: 'Hello ✔',
      text: 'Here is reset password link',
      html: `<b>Hello, ${user.name}</b><p>Click <a href="${link}">here</a> to reset password</p>`,
    });
  } catch (err) {
    console.log(err);
  }
};
