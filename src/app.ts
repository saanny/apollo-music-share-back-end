import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import { buildSchema } from "type-graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { SongResolver } from "./resolvers/SongResolver";
import { createConnection } from "typeorm";
import { Song } from "./entities/song";
import { QueueSongs } from "./entities/queue";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
export default class App {
  public app: Application;
  public apolloServer: ApolloServer;
  constructor() {
    this.app = express();
  }
  public async start() {
    this.app.use(cors(corsOptions));

    try {
      await createConnection({
        type: "mongodb",
        useUnifiedTopology: true,
        host: "localhost",
        port: 27017,
        database: "songList",
        entities: [Song, QueueSongs],
      });
    } catch (error) {
      console.log(error);
    }
    this.apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [SongResolver],
        validate: false,
      }),
      context: ({ req, res }) => ({ req, res }),
    });
    this.apolloServer.applyMiddleware({ app: this.app, cors: false });
    this.app.listen("5000", () => {
      console.log("app is running on port 5000");
    });
  }
}
