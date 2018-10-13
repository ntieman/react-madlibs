const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const path = require('path');

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.use('/music', express.static(path.join(__dirname, '..', 'music')));
console.log(path.join(__dirname, '..', 'music'));
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000`);
});