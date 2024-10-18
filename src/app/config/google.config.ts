import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('google', () => ({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // callbackURL: process.env.GOOGLE_CALLBACK_URL,
  callbackURL: 'http://localhost:3000',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
}));
