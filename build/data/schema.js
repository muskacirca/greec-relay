'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Schema = undefined;

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _WreckStore = require('./WreckStore');

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
        console.log("Im here");
        return (0, _WreckStore.getById)(id);
    } else if (type === "Viewer") {
        console.log("Im here getting vieweer");
        return (0, _WreckStore.getViewer)(id);
    }
    return null;
}, function (obj) {
    if (obj instanceof _WreckStore.Wreck) {
        return GraphQLWreckType;
    } else if (obj instanceof _WreckStore.Viewer) {
        return GraphQLViewer;
    }
});

var nodeInterface = _nodeDefinitions.nodeInterface;
var nodeField = _nodeDefinitions.nodeField;

var GraphQLWreckType = new _graphql.GraphQLObjectType({
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

var GraphQLViewer = new _graphql.GraphQLObjectType({
    name: 'Viewer',
    fields: function fields() {
        return {
            id: (0, _graphqlRelay.globalIdField)('Viewer'),
            wrecks: {
                type: WrecksConnection,
                args: _extends({}, _graphqlRelay.connectionArgs),
                resolve: function resolve(obj, _ref) {
                    var args = _objectWithoutProperties(_ref, []);

                    console.log("retrieving data ...");

                    console.log("is initialized : " + (0, _WreckStore.isInitialized)());
                    if ((0, _WreckStore.isInitialized)()) {
                        console.log("data retrieved from cache : " + (0, _WreckStore.getWrecks)().length);
                        return (0, _graphqlRelay.connectionFromArray)((0, _WreckStore.getWrecks)(), args);
                    }

                    return _db2.default.models.wreck.findAll().then(function (response) {
                        console.log("data retrieved from remote : " + JSON.stringify(response.length));
                        (0, _WreckStore.initState)(response);
                        return response;
                    });

                    //connectionFromPromisedArray(axios.get("http://greec-muskacirca.rhcloud.com/greec/rs/wrecks/lightweight")
                    //    .then((response) => {
                    //        console.log("data retrieved from remote.")
                    //        initState(response.data)
                    //        return response.data
                    //    }), args)
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

                    console.log("retrieving data by id : " + id);

                    var wreck = (0, _WreckStore.getById)(id);
                    if (wreck !== undefined) {
                        console.log("data retrieved from cache : " + JSON.stringify(wreck));
                        return wreck;
                    }

                    return _db2.default.models.wreck.findById(id).then(function (response) {
                        console.log("data retrieved from remote : " + JSON.stringify(response));
                        (0, _WreckStore.pushWreck)(response);
                        return response;
                    });

                    //return axios.get("http://greec-muskacirca.rhcloud.com/greec/rs/wrecks/" + id)
                    //    .then((response) => {
                    //        console.log("data retrieved : " + JSON.stringify(response.data))
                    //        pushWreck(response.data)
                    //        return response.data
                    //    })
                }
            }
        };
    },
    interfaces: [nodeInterface]
});

var GraphQLRoot = new _graphql.GraphQLObjectType({
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

var Mutation = new _graphql.GraphQLObjectType({
    name: 'Mutation',
    description: 'Function to create wreck',
    fields: function fields() {
        return {
            addWreck: {
                type: GraphQLWreckType,
                args: {
                    name: {
                        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
                    },
                    latitude: {
                        type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat)
                    },
                    longitude: {
                        type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat)
                    },
                    shortDescription: {
                        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
                    },
                    description: {
                        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
                    },
                    sinkDate: {
                        type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
                    },
                    imagePath: {
                        type: _graphql.GraphQLString
                    }
                },
                resolve: function resolve(_, args) {
                    return _axios2.default.post('/greec/rs/wrecks', data).then(function (response) {
                        console.log("return of the wreck: " + response.data);
                        return {
                            name: response.data.name,
                            latitude: response.data.latitude,
                            longitude: response.data.longitude,
                            shortDescription: response.data.shortDescription,
                            description: response.data.description,
                            sinkDate: response.data.sinkDate,
                            imagePath: response.data.imagePath
                        };
                    });
                }
            }
        };
    }
});

var Schema = exports.Schema = new _graphql.GraphQLSchema({
    query: GraphQLRoot,
    mutation: Mutation
});