import { SeederInterface } from './interfaces/seeder.interface';
import { PrismaClient } from '@prisma/client';

export default class PaymentSystemSeeder implements SeederInterface {
  async run(prisma: PrismaClient) {
    await prisma.paymentSystem.deleteMany();

    await prisma.paymentSystem.create({
      data: {
        name: 'Stripe',
        merchant: 'stripe',
        is_active: true,
        sort_order: 0,
      },
    });
  }
}
