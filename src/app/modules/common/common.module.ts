import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [ScraperModule, GraphqlModule, AuthModule, PaymentModule, PdfModule],
})
export class CommonModule {}
