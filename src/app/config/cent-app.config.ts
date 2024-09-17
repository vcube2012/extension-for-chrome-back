import { registerAs } from '@nestjs/config';

export default registerAs('cent_app', () => ({
  secret: process.env.CENT_APP_SECRET,
  shopId: process.env.CENT_APP_SHOP_ID,
}));
