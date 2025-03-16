const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    birthday: String!
    quantity: Int!
    avatar: String
  }
  
  input CreateUserInput {
    name: String!
    birthday: String!
    quantity: Int!
    avatar: String
  }
  
  input UpdateUserInput {
    name: String
    birthday: String
    quantity: Int
    avatar: String
  }
  
  type Query {
    users: [User]!
    user(id: ID!): User
  }
  
  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
    updateUserQuantity(id: ID!, quantity: Int!): User!
    updateUserBirthday(id: ID!, birthday: String!): User!
  }
`;

module.exports = typeDefs;
