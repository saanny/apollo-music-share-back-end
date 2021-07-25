import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@ObjectType()
@Entity("queue")
export class QueueSongs extends BaseEntity {
  @Field(() => String)
  @ObjectIdColumn()
  id: ObjectID;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  artist: string;

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => String)
  @Column()
  thumbnail: string;

  @Field(() => Number)
  @Column()
  duration: number;

  @Field(() => String)
  @Column()
  created_at: Date;
}
