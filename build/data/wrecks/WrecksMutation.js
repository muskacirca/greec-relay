'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AddOrUpdateWreckMutation = undefined;

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _WreckModel = require('./WreckModel');

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AddOrUpdateWreckMutation = exports.AddOrUpdateWreckMutation = new _graphqlRelay.mutationWithClientMutationId({
    name: 'AddOrUpdateWreck',
    description: 'Function to add a comment to an item',
    inputFields: {
        id: { type: _graphql.GraphQLString },
        name: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
        latitude: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat) },
        longitude: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat) },
        shortDescription: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
        description: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
        sinkDate: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
        imagePath: { type: _graphql.GraphQLString },
        file: { type: _graphql.GraphQLString }
    },
    outputFields: {
        wreck: {
            type: _WreckModel.GraphQLWreckType,
            resolve: function resolve(rootvalue) {

                //  const file = rootvalue.request.file;

                return {};
            }
        }
    },
    mutateAndGetPayload: function mutateAndGetPayload(wreck) {

        console.log("yoooo : " + JSON.stringify(wreck));

        if (wreck.imagePath) {
            var imageName = wreck.file.substring(0, wreck.file.lastIndexOf('.'));
            var mimeType = wreck.file.substring(wreck.file.lastIndexOf('.'));
            console.log("imageName : " + JSON.stringify(imageName));
            console.log("mineType : " + JSON.stringify(mimeType));
        }

        if (!wreck.id) {
            console.log("creating : " + JSON.stringify(wreck));
            return _db2.default.models.wreck.create(wreck).then(function (r) {
                return r;
            });
        } else {
            wreck.id = (0, _graphqlRelay.fromGlobalId)(wreck.id).id;
            wreck.imagePath = wreck.file;
            console.log("updating : " + JSON.stringify(wreck));
            return _db2.default.models.wreck.update(wreck, { where: { id: wreck.id } }).then(function (r) {
                console.log("r : " + JSON.stringify(r));
                return r;
            });
        }
    }
});