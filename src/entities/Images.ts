import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@ObjectType()
@Entity("images")
export class Images extends BaseEntity {
  @Field(() => String)
  @ObjectIdColumn()
  id: ObjectID;

  @Field(() => String)
  @Column()
  name: string;
}
