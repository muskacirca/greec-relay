import express from 'express'
import {Schema} from './data/schema';
import graphQLHTTP from 'express-graphql';

const graphql_app = express();

var graphql_port = 5000

graphql_app.use('/', graphQLHTTP({ schema: Schema, pretty: true, graphiql: true}));
graphql_app.listen(graphql_port, (err) => {
    if (err)
        return console.error(err);
    console.log('GraphQL Server is now running on port : ' + graphql_port);
});
