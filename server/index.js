const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const db = require('./db');

const app = express();

// Increase payload size limit and add CORS
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

async function startServer() {
  // Initialize the database
  await db.initialize();
  
  // Create Apollo GraphQL server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: { db }
  });
  
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

startServer().catch(console.error);
