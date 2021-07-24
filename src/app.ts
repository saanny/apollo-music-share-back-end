import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import { buildSchema } from "type-graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { UploadResolver } from "./resolvers/UploadResolver";
import path, { resolve } from "path";
import { createConnection } from "typeorm";
import { Images } from "./entities/Images";
export default class App {
  public app: Application;
  public apolloServer: ApolloServer;
  constructor() {
    this.app = express();
  }
  public async start() {
    this.app.use("/public", express.static(path.join(__dirname, "../public")));
    this.app.use(express.static(resolve("public")));
    this.app.use(
      graphqlUploadExpress({
        maxFileSize: 10000000,
        maxFiles: 10,
      })
    );
    try {
      await createConnection({
        type: "mongodb",
        useUnifiedTopology: true,
        host: "localhost",
        port: 27017,
        database: "uploadGraphql",
        entities: [Images],
      });
    } catch (error) {
      console.log(error);
    }
    this.apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UploadResolver],
        validate: false,
      }),
      context: ({ req, res }) => ({ req, res }),
      uploads: false,
    });
    this.apolloServer.applyMiddleware({ app: this.app, cors: false });
    this.app.listen("5000", () => {
      console.log("app is running on port 5000");
    });
  }
}
