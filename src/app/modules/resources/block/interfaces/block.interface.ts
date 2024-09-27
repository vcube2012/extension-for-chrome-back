import { Field, ID, InterfaceType, registerEnumType } from '@nestjs/graphql';
import { BlockPage } from '../enums/block-page.enum';
import { BlockType } from '../enums/block-type.enum';

registerEnumType(BlockPage, { name: 'BlockPage' });
registerEnumType(BlockType, { name: 'BlockType' });

@InterfaceType()
export class BlockInterface {
  @Field(() => ID)
  id: number;

  @Field()
  active: boolean;

  @Field()
  name: string;

  @Field(() => BlockPage)
  page: string;

  @Field()
  type: BlockType;

  @Field(() => String)
  content: any;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
