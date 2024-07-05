import { ApolloServer } from 'apollo-server-koa';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { resolvers } from '../graphql/resolvers';
import { typeDefs } from '../graphql/schema';
import router from './routes';

const app = new Koa();

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ ctx }) => ({
    req: ctx.req,
  }),
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

export { startApolloServer };
