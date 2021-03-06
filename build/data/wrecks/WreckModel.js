'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GraphQLRoot = exports.GraphQLViewer = exports.WrecksConnection = exports.GraphQLWreckType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _WreckStore = require('../WreckStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * The first argument defines the way to resolve an ID to its object.
 * The second argument defines the way to resolve a node object to its GraphQL type.
 */

var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
    var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId);

    var id = _fromGlobalId.id;
    var type = _fromGlobalId.type;

    if (type === 'WreckType') {
        return _db2.default.models.wreck.findById(id);
    } else if (type === "Viewer") {
        return (0, _WreckStore.getViewer)(id);
    }
    return null;
}, function (obj) {
    if (obj.latitude) {
        return GraphQLWreckType;
    } else {
        return GraphQLViewer;
    }
});

var nodeInterface = _nodeDefinitions.nodeInterface;
var nodeField = _nodeDefinitions.nodeField;
var GraphQLWreckType = exports.GraphQLWreckType = new _graphql.GraphQLObjectType({
    name: 'WreckType',
    fields: {
        id: (0, _graphqlRelay.globalIdField)('WreckType'),
        wreckId: {
            type: _graphql.GraphQLString,
            resolve: function resolve(obj) {
                return obj.id;
            }
        },
        name: {
            type: _graphql.GraphQLString,
            resolve: function resolve(obj) {
                return obj.name;
            }
        },
        shortDescription: {
            type: _graphql.GraphQLString,
            resolve: function resolve(obj) {
                return obj.shortDescription;
            }
        },
        description: {
            type: _graphql.GraphQLString,
            resolve: function resolve(obj) {
                return obj.description;
            }
        },
        latitude: {
            type: _graphql.GraphQLFloat,
            resolve: function resolve(obj) {
                return obj.latitude;
            }
        },
        longitude: {
            type: _graphql.GraphQLFloat,
            resolve: function resolve(obj) {
                return obj.longitude;
            }
        },
        sinkDate: {
            type: _graphql.GraphQLString,
            resolve: function resolve(obj) {
                return obj.sinkDate;
            }
        },
        imagePath: {
            type: _graphql.GraphQLString,
            resolve: function resolve(obj) {
                return obj.imagePath;
            }
        }
    },
    interfaces: [nodeInterface]
});

var _connectionDefinition =
// ,edgeType: GraphQLSimTypesEdge,
(0, _graphqlRelay.connectionDefinitions)({
    name: 'WreckType',
    nodeType: GraphQLWreckType
});

var WrecksConnection = _connectionDefinition.connectionType;
exports.WrecksConnection = WrecksConnection;
var GraphQLViewer = exports.GraphQLViewer = new _graphql.GraphQLObjectType({
    name: 'Viewer',
    fields: function fields() {
        return {
            id: (0, _graphqlRelay.globalIdField)('Viewer'),
            wrecks: {
                type: WrecksConnection,
                args: _extends({}, _graphqlRelay.connectionArgs),
                resolve: function resolve(obj, _ref) {
                    var args = _objectWithoutProperties(_ref, []);

                    return _db2.default.models.wreck.findAll().then(function (response) {
                        return (0, _graphqlRelay.connectionFromArray)(response, args);
                    });
                }
            },
            wreck: {
                type: GraphQLWreckType,
                args: {
                    id: {
                        type: _graphql.GraphQLString
                    }
                },
                resolve: function resolve(obj, _ref2) {
                    var id = _ref2.id;
                    return _db2.default.models.wreck.findById(id).then(function (response) {
                        return response;
                    });
                }
            }
        };
    },
    interfaces: [nodeInterface]
});

var GraphQLRoot = exports.GraphQLRoot = new _graphql.GraphQLObjectType({
    name: 'Root',
    fields: {
        viewer: {
            type: GraphQLViewer,
            resolve: function resolve() {
                return _WreckStore.getViewer;
            }
        },
        node: nodeField
    }
});