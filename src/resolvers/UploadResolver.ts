import { Song } from "../entities/song";
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  ObjectType,
  Field,
  InputType,
} from "type-graphql";
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
  @Field()
  title: string;
  @Field()
  artist: string;
  @Field()
  url: string;
  @Field()
  duration: number;
  @Field()
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

  @Mutation(() => Boolean)
  async createSong(@Arg("input") input: CreateSongInput): Promise<Boolean> {
    try {
      await this.songRepository
        .create({
          ...input,
        })
        .save();
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
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
  async deleteSong(@Arg("id") id: string) {
    try {
      await this.songRepository.delete(id);
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
