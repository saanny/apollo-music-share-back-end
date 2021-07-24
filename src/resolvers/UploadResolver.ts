import { Images } from "../entities/Images";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { getMongoRepository, MongoRepository } from "typeorm";
import { GraphQLUpload } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import storeUpload from "../utils/storeUpload";

@Resolver()
export class UploadResolver {
  constructor(
    @InjectRepository(Images)
    private uploadRepository: MongoRepository<Images>
  ) {
    this.uploadRepository = getMongoRepository(Images);
  }
  @Query(() => [Images])
  images(): Promise<Images[]> {
    return this.uploadRepository.find();
  }
  @Mutation(() => String)
  async uploadImage(
    @Arg("file", (type) => GraphQLUpload) file: FileUpload
  ): String {
    let storedFileName: string;
    try {
      storedFileName = await storeUpload(file);
    } catch (error) {
      console.log(error);
    }
    try {
      await this.uploadRepository.create({
        name: storedFileName,
      });
    } catch (error) {
      console.log(error);
    }
    return storedFileName;
  }
}
