import { gql } from 'apollo-server-koa';

export const typeDefs = gql`
  type Query {
    ping: String
    getPixKey(userId: String!): String
  }

  type Mutation {
    initiatePixTransaction(pixKey: String!, value: Float!): String
  }
`;
