import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('jwt', () => ({
  secret: process.env.GOOGLE_CLIENT_ID,
}));
