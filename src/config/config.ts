import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().url().describe('Mongo DB url'),
  JWT_SECRET: z.string().describe('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(30).describe('minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(30).describe('days after which refresh tokens expire'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number().default(10).describe('minutes after which reset password token expires'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce.number().default(10).describe('minutes after which verify email token expires'),
  SMTP_HOST: z.string().describe('server that will send the emails'),
  SMTP_PORT: z.coerce.number().describe('port to connect to the email server'),
  SMTP_USERNAME: z.string().describe('username for email server'),
  SMTP_PASSWORD: z.string().describe('password for email server'),
  EMAIL_FROM: z.string().email().describe('the from field in the emails sent by the app'),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  throw new Error(`Config validation error: ${envVars.error.message}`);
}

export const config = {
  env: envVars.data.NODE_ENV,
  port: envVars.data.PORT,
  mongoose: {
    url: envVars.data.MONGODB_URI,
    options: {
      // Mongoose 6+ defaults are good, but can be explicit here if needed
    },
  },
  jwt: {
    secret: envVars.data.JWT_SECRET,
    accessExpirationMinutes: envVars.data.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.data.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.data.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.data.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.data.SMTP_HOST,
      port: envVars.data.SMTP_PORT,
      auth: {
        user: envVars.data.SMTP_USERNAME,
        pass: envVars.data.SMTP_PASSWORD,
      },
    },
    from: envVars.data.EMAIL_FROM,
  },
};