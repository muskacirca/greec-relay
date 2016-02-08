'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _schema = require('./data/schema');

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graphql_app = (0, _express2.default)();

var graphql_port = 5000;

graphql_app.use('/', (0, _expressGraphql2.default)({ schema: _schema.Schema, pretty: true, graphiql: true }));
graphql_app.listen(graphql_port, function (err) {
    if (err) return console.error(err);
    console.log('GraphQL Server is now running on port : ' + graphql_port);
});