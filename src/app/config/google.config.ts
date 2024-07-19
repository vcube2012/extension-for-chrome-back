import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('google', () => ({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scopes: ['profile', 'email'],
  maxAccessTokenAge: 2592000000,
}));
