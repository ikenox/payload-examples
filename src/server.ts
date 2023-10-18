import { makeExecutableSchema } from "@graphql-tools/schema";
import { stitchSchemas } from "@graphql-tools/stitch";
import express from "express";
import payload from "payload";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";

require("dotenv").config();
const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  const payloadInstance = await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  const schema1 = makeExecutableSchema({
    resolvers: { Query: { hello: () => "Hello world!" } },
    typeDefs: `type Query { hello: String }`,
  });
  const schema2 = payloadInstance.schema;

  const stitchedSchema = stitchSchemas({
    subschemas: [schema1, schema2],
  });
  const server = new ApolloServer({ schema: stitchedSchema });
  await server.start();

  app.use("/merged-graphql", express.json(), expressMiddleware(server));

  app.listen(3000);
};

start();
