
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const db = require('./db');

async function startServer() {
  // Initialize the database
  await db.initialize();
  
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
  // Create Apollo GraphQL server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { db }
  });
  
  await server.start();
  server.applyMiddleware({ app });
  
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
});
