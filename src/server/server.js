#!/bin/env node
import proxy from 'express-http-proxy'
import express from 'express'
import path from 'path'

import {Schema} from './data/schema';
import graphQLHTTP from 'express-graphql';

const server_port = process.env.PORT || 3000

const graphql_ip = process.env.NODE_ENV === 'production' ? 'https://nodejsserverwithreact.herokuapp.com' : 'localhost'
const graphql_port =   '5000'

var app = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../src/frontend/index.html"));
})

app.use('/style', express.static(path.resolve(__dirname, '../src/style')));
app.use('/utils', express.static(path.resolve(__dirname, '../src/utils')));
app.use('/public', express.static(path.resolve(__dirname, '../src/public')));

app.get('/bundle.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../lib/bundle.js"));
})

app.use('/graphql', graphQLHTTP({ schema: Schema, pretty: true, graphiql: true}));

//app.use("/graphql", proxy(graphql_ip + ':' + graphql_port, {
//    forwardPath: function(req, res) {
//        return require('url').parse(req.url).path;
//    }
//}))

app.listen(server_port, (err) => {
    if(err) return console.log(err)
    console.log('Server is now running on port ' + server_port);
})



