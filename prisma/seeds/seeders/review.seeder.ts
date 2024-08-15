import { SeederInterface } from './interfaces/seeder.interface';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export default class ReviewSeeder implements SeederInterface {
  async run(prisma: PrismaClient) {
    await prisma.review.deleteMany();

    for (const item of this.getItems()) {
      await prisma.review.create({
        data: {
          ...item,
        },
      });
    }
  }

  private getItems() {
    return [
      {
        rating: 5,
        text: 'Wonderful extension. It allows you to see crime maps, wires, cell towers, superfunds (polluted places).',
        author: faker.person.fullName(),
        sort_order: 0,
      },
      {
        rating: 5,
        text: 'This is a must have extension, SAVES you big time. Worth the subscription for sure. Amazing features about the property, the info that you have to spend hours to get online',
        author: faker.person.fullName(),
        sort_order: 1,
      },
      {
        rating: 5,
        text: 'I found it helpful to find the best house with different metrics provided by Homeluten. Highly recommend.',
        author: faker.person.fullName(),
        sort_order: 2,
      },
      {
        rating: 5,
        text: 'First time home buyer who can get super overwhelmed with all the options, this is a great way to organize my thoughts!',
        author: faker.person.fullName(),
        sort_order: 3,
      },
    ];
  }
}
