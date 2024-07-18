import { Resolver, Query, Args } from '@nestjs/graphql';
import { ZipCodeService } from './zip-code.service';
import { ZipCode } from './entity/zip-code.entity';

@Resolver(() => ZipCode)
export class ZipCodeResolver {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Query(() => [ZipCode!]!, { name: 'findManyZipCodes' })
  findMany(@Args('codes', { type: () => [String!]! }) codes: string[]) {
    return this.zipCodeService.findManyByCodes(codes);
  }

  @Query(() => ZipCode, { name: 'findZipCode' })
  findOne(@Args('code', { type: () => String! }) code: string) {
    return this.zipCodeService.findByCode(code);
  }
}
