const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose')
const Auth = require('./services/auth.service')
const typeDefs = require('./graphql/schema/index')
const resolvers = require('./graphql/resolvers/index')

mongoose.connect(
  "mongodb://localhost:27017/brutal-tats",
  { useNewUrlParser: true, useUnifiedTopology: true }
)

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => {
    return {
      ...req,
      userId:
        req
          ? Auth.getUserId({req})
          : null
    };
  }
})



try {
  mongoose.connection.once("open", function() {
    server.start(
      {
        port: 3000,
        playground: '/graphql',
        endpoint: '/brutal-tats'
      }, 
      () => console.log('Server is running on localhost:3000'))
  });
} catch (e) {
  throw new Error(e)
}