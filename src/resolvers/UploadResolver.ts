import { Song } from "../entities/song";
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  ObjectType,
  Field,
  InputType,
  Subscription,
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
  @Field(() => String!)
  duration: number;
  @Field(() => String!)
  thumbnail: string;
}
@Resolver()
export class SongResolver {
  constructor(
    @InjectRepository(Song)
    private songRepository: MongoRepository<Song>
  ) {
    this.songRepository = getMongoRepository(Song);
  }
  @Query(() => [Song])
  songs(): Promise<Song[]> {
    return this.songRepository.find();
  }
  @Query(() => [Song])
  Subscription(): Promise<Song[]> {
    return this.songRepository.find();
  }

  @Mutation(() => Song!)
  async createSong(@Arg("input") input: CreateSongInput): Promise<Song> {
    return this.songRepository
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

  // @Mutation(() => DeleteSongResponse)
  // async deleteSong(@Arg("id") id: string) {
  //   try {
  //     await this.songRepository.delete(id);
  //     return {
  //       id,
  //       deleted: true,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       id,
  //       deleted: false,
  //     };
  //   }
  // }
}
