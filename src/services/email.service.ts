import { config } from '../config/config';
import { logger } from '../config/logger';

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise<void>}
 */
export const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = { from: config.email.from, to, subject, text };
  // In a real app, use nodemailer here.
  logger.info(`[EMAIL SERVICE] Sending email to ${to} with subject: "${subject}"`);
  if (config.env === 'development') {
      logger.debug(`[EMAIL CONTENT]: ${text}`);
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}`; // Adjust URL as needed
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to: string, token: string) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `http://localhost:3000/verify-email?token=${token}`; // Adjust URL as needed
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};