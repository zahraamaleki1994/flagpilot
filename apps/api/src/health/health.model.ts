import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Health {
  @Field()
  status: string;

  @Field()
  mongo: string;

  @Field()
  redis: string;
}
