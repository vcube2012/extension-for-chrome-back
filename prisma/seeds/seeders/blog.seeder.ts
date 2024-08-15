import { SeederInterface } from './interfaces/seeder.interface';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { getRandomInt } from '../../../helpers/helpers';
import * as lodash from 'lodash';

export default class BlogSeeder implements SeederInterface {
  async run(prisma: PrismaClient) {
    await prisma.blog.deleteMany();

    for (const title of this.getTitles()) {
      await prisma.blog.create({
        data: {
          slug: lodash.kebabCase(title),
          title: title,
          image: faker.image.url(),
          content: faker.lorem.text(),
          is_active: true,
        },
      });
    }
  }

  private getTitles() {
    return [
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
      faker.word.words({ count: getRandomInt(2, 5) }),
    ];
  }
}
