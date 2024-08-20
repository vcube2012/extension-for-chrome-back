import { SeederInterface } from './interfaces/seeder.interface';
import PackageSeeder from './package.seeder';
import StaticPageSeeder from './static-page.seeder';
import BlogSeeder from './blog.seeder';
import FaqSeeder from './faq.seeder';
import ReviewSeeder from './review.seeder';
import SiteSettingSeeder from './site-setting.seeder';
import AdminSeeder from './admin.seeder';

export const seeders: Array<SeederInterface> = [
  new PackageSeeder(),
  new StaticPageSeeder(),
  new BlogSeeder(),
  new FaqSeeder(),
  new ReviewSeeder(),
  new SiteSettingSeeder(),
  new AdminSeeder(),
];
