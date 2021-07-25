import { Song } from "../entities/song";
import { QueueSongs } from "../entities/queue";
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  ObjectType,
  Field,
  InputType,
  Subscription,
  Float,
} from "type-graphql";
import { ApolloError } from "apollo-server";

import { InjectRepository } from "typeorm-typedi-extensions";
import { getMongoRepository, MongoRepository } from "typeorm";
@ObjectType()
export class DeleteSongResponse {
  @Field(() => String)
  id: string;
  @Field(() => Boolean)
  deleted: Boolean;
}

@InputType()
export class CreateSongInput {
  @Field(() => String!)
  title: string;
  @Field(() => String!)
  artist: string;
  @Field(() => String!)
  url: string;
  @Field(() => Float!)
  duration: number;
  @Field(() => String!)
  thumbnail: string;
}
@Resolver()
export class SongResolver {
  constructor(
    @InjectRepository(Song)
    private songRepository: MongoRepository<Song>,
    @InjectRepository(QueueSongs)
    private queueRepository: MongoRepository<QueueSongs>
  ) {
    this.songRepository = getMongoRepository(Song);
    this.queueRepository = getMongoRepository(QueueSongs);
  }
  @Query(() => [Song])
  songs(): Promise<Song[]> {
    return this.songRepository.find();
  }
  @Query(() => [Song])
  queue(): Promise<Song[]> {
    return this.queueRepository.find();
  }
  @Mutation(() => Song!)
  async createSong(@Arg("input") input: CreateSongInput): Promise<Song> {
    return this.songRepository
      .create({
        ...input,
      })
      .save();
  }

  @Mutation(() => Song!)
  async addQueue(@Arg("input") input: CreateSongInput): Promise<Song> {
    return this.queueRepository
      .create({
        ...input,
      })
      .save();
  }

  @Query(() => Song!, { nullable: true })
  song(@Arg("id") id: string) {
    try {
      return this.songRepository.findOne(id);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => DeleteSongResponse)
  async deleteQueueSong(@Arg("id") id: string) {
    try {
      await this.queueRepository.delete(id);
      return {
        id,
        deleted: true,
      };
    } catch (error) {
      console.log(error);
      return {
        id,
        deleted: false,
      };
    }
  }
}
