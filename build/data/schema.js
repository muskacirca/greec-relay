'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Schema = undefined;

var _graphql = require('graphql');

var _WrecksMutation = require('./wrecks/WrecksMutation');

var _WreckModel = require('./wrecks/WreckModel');

var Mutations = new _graphql.GraphQLObjectType({
    name: 'Mutation',
    description: 'Mother of all mutations',
    fields: function fields() {
        return {
            addOrUpdateWreck: _WrecksMutation.AddOrUpdateWreckMutation
        };
    }
});

var Schema = exports.Schema = new _graphql.GraphQLSchema({
    query: _WreckModel.GraphQLRoot,
    mutation: Mutations
});