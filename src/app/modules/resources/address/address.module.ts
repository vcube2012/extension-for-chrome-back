import { Module } from '@nestjs/common';
import { AddressResolver } from './address.resolver';
import { AddressService } from './address.service';
import { UserService } from '../user/user.service';
import { PdfService } from '../../common/pdf/pdf.service';
import { AddressPdfService } from './address-pdf.service';

@Module({
  providers: [
    AddressResolver,
    AddressService,
    AddressPdfService,
    UserService,
    PdfService,
  ],
})
export class AddressModule {}
