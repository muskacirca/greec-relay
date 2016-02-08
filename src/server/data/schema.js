import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
} from 'graphql'

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromPromisedArray,
    connectionFromArray,
    fromGlobalId,
    globalIdField,
    nodeDefinitions
} from 'graphql-relay'

import axios from 'axios'
import Database from './db'

import {
    Wreck,
    Viewer,
    initState,
    getById,
    getViewer,
    getWrecks,
    pushWreck,
    isInitialized
} from './WreckStore';

/**
 * The first argument defines the way to resolve an ID to its object.
 * The second argument defines the way to resolve a node object to its GraphQL type.
 */
var { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        let { id, type } = fromGlobalId(globalId);
        if (type === 'WreckType') {
            console.log("Im here")
            return getById(id)
        } else if (type === "Viewer") {
            console.log("Im here getting vieweer")
            return getViewer(id);
        }
        return null;
    },
    (obj) => {
        if (obj instanceof Wreck) {
            return GraphQLWreckType;
        } else if (obj instanceof Viewer) {
            return GraphQLViewer
        }
    }
);

var GraphQLWreckType = new GraphQLObjectType({
    name: 'WreckType',
    fields: {
        id: globalIdField('WreckType'),
        wreckId: {
            type: GraphQLString,
            resolve: (obj) => obj.id
        },
        name: {
            type: GraphQLString,
            resolve: (obj) => obj.name
        },
        shortDescription: {
            type: GraphQLString,
            resolve: (obj) => obj.shortDescription
        },
        description: {
            type: GraphQLString,
            resolve: (obj) => obj.description
        },
        latitude: {
            type: GraphQLFloat,
            resolve: (obj) => obj.latitude
        },
        longitude: {
            type: GraphQLFloat,
            resolve: (obj) => obj.longitude
        },
        sinkDate: {
            type: GraphQLString,
            resolve: (obj) => obj.sinkDate
        },
        imagePath: {
            type: GraphQLString,
            resolve: (obj) => obj.imagePath
        }
    },
    interfaces: [nodeInterface]
});

var {
    connectionType: WrecksConnection
    // ,edgeType: GraphQLSimTypesEdge,
    } = connectionDefinitions({
    name: 'WreckType',
    nodeType: GraphQLWreckType
});

var GraphQLViewer = new GraphQLObjectType({
    name: 'Viewer',
    fields: () => ({
        id: globalIdField('Viewer'),
        wrecks: {
            type: WrecksConnection,
            args: {...connectionArgs},
            resolve: (obj, {...args}) => {
                console.log("retrieving data ...")

                console.log("is initialized : " + isInitialized())
                if (isInitialized()) {
                    console.log("data retrieved from cache : " + getWrecks().length)
                    return connectionFromArray(getWrecks(), args)
                }

                return Database.models.wreck.findAll()
                            .then((response) => {
                                console.log("data retrieved from remote : " + JSON.stringify(response.length))
                                initState(response)
                                return response
                            })


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
                    type: GraphQLString
                }
            },
            resolve: (obj, {id}) => {
                console.log("retrieving data by id : " + id)

                var wreck = getById(id)
                if (wreck !== undefined) {
                    console.log("data retrieved from cache.")
                    return wreck
                }

                return Database.models.wreck.findById(id)
                    .then((response) => {
                        console.log("data retrieved from remote : " + JSON.stringify(response))
                        pushWreck(response)
                        return response
                    })

                //return axios.get("http://greec-muskacirca.rhcloud.com/greec/rs/wrecks/" + id)
                //    .then((response) => {
                //        console.log("data retrieved : " + JSON.stringify(response.data))
                //        pushWreck(response.data)
                //        return response.data
                //    })
            }
        }
    }),
    interfaces: [nodeInterface]
});

var GraphQLRoot = new GraphQLObjectType({
    name: 'Root',
    fields: {
        viewer: {
            type: GraphQLViewer,
            resolve: () => getViewer
        },
        node: nodeField
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Function to create wreck',
    fields() {
        return {
            addWreck: {
                type: GraphQLWreckType,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    latitude: {
                        type: new GraphQLNonNull(GraphQLFloat)
                    },
                    longitude: {
                        type: new GraphQLNonNull(GraphQLFloat)
                    },
                    shortDescription: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    description: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    sinkDate: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    imagePath: {
                        type: GraphQLString
                    }
                },
                resolve(_, args) {
                    return axios.post('/greec/rs/wrecks', data)
                        .then((response) => {
                            console.log("return of the wreck: " + response.data)
                            return {
                                name: response.data.name,
                                latitude: response.data.latitude,
                                longitude: response.data.longitude,
                                shortDescription: response.data.shortDescription,
                                description: response.data.description,
                                sinkDate: response.data.sinkDate,
                                imagePath: response.data.imagePath
                            }
                        })
                }
            }
        }
    }
})

export var Schema = new GraphQLSchema({
    query: GraphQLRoot,
    mutation: Mutation
});
