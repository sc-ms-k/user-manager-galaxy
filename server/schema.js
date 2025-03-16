
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    birthday: String!
    quantity: Int!
  }
  
  type Query {
    users: [User]!
    user(id: ID!): User
  }
  
  type Mutation {
    createUser(name: String!, birthday: String!, quantity: Int!): User
    updateUser(id: ID!, name: String, birthday: String, quantity: Int): User
    deleteUser(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
