import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secret: process.env.STRIPE_SECRET,
  redirect_uri:
    process.env.STRIPE_REDIRECT_URI ?? 'http://localhost:4000/graphql',
}));
