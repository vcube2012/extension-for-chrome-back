import {
  createUnionType,
  Field,
  Float,
  Int,
  ObjectType,
  OmitType,
  registerEnumType,
} from '@nestjs/graphql';
import { BlockInterface } from '../interfaces/block.interface';
import { AdvantageBlockPage } from '../enums/advantage-block-page.enum';

registerEnumType(AdvantageBlockPage, { name: 'AdvantageBlockPage' });

export const BlockContent = createUnionType({
  name: 'BlockContent',
  types: () =>
    [
      HomeHeaderBlock,
      HomePartnersBlock,
      HomeHouseBlock,
      HomeAdvantagesBlock,
      HouseReviewsBlock,
    ] as const,
  resolveType(value) {
    if ('animation_words' in value) {
      return HomeHeaderBlock;
    }
    if ('houses' in value) {
      return HomeHouseBlock;
    }
    if ('reviews' in value) {
      return HouseReviewsBlock;
    }
    if ('blocks' in value) {
      return HomeAdvantagesBlock;
    }
    if ('images' in value) {
      return HomePartnersBlock;
    }
    return null;
  },
});

@ObjectType()
export class BlockEntity extends OmitType(
  BlockInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field(() => BlockContent)
  content: any;
}

@ObjectType()
class HouseReviewsBlock {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [Review])
  reviews: Review[];
}

@ObjectType()
class Review {
  @Field()
  author: string;

  @Field()
  text: string;

  @Field(() => Int)
  rating: number;
}

@ObjectType()
class HomeAdvantagesBlock {
  @Field()
  text: string;

  @Field()
  styled_text: string;

  @Field(() => [AdvantageBlock])
  blocks: AdvantageBlock[];
}

@ObjectType()
class AdvantageBlock {
  @Field()
  text: string;

  @Field()
  title: string;

  @Field()
  page: AdvantageBlockPage;

  @Field(() => [TextBlock])
  advantages: TextBlock[];
}

@ObjectType()
class TextBlock {
  @Field()
  text: string;
}

@ObjectType()
class HomeHouseBlock {
  @Field()
  text: string;

  @Field()
  styled_text: string;

  @Field(() => [HouseInfo])
  houses: HouseInfo[];

  @Field(() => [Advantage])
  advantages: Advantage[];
}

@ObjectType()
class Advantage {
  @Field()
  styled_text: string;

  @Field()
  text: string;
}

@ObjectType()
class HouseInfo {
  @Field(() => Float)
  beds: number;

  @Field(() => Float)
  baths: number;

  @Field(() => String)
  square: string;

  @Field(() => String)
  down: string;

  @Field(() => String)
  cashflow: string;

  @Field(() => String)
  cap_rate: string;

  @Field(() => String)
  price: string;

  @Field(() => String)
  image: string;

  @Field()
  address: string;

  @Field(() => String)
  sub_text: string;
}

@ObjectType()
class HomePartnersBlock {
  @Field()
  text: string;

  @Field(() => [ImageWithLink])
  images: ImageWithLink[];
}

@ObjectType()
class ImageWithLink {
  @Field()
  image: string;

  @Field()
  link: string;
}

@ObjectType()
class HomeHeaderBlock {
  @Field()
  title: string;

  @Field(() => [AnimationWord])
  animation_words: AnimationWord[];
}

@ObjectType()
class AnimationWord {
  @Field()
  word: string;
}
