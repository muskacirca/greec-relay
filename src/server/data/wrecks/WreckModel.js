import {
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLString,
} from 'graphql'

import {
    connectionArgs,
    connectionFromArray,
    connectionDefinitions,
    fromGlobalId,
    globalIdField,
    nodeDefinitions,
} from 'graphql-relay'

import Database from '../db'

import {
    Wreck,
    Viewer,
    initState,
    getById,
    getViewer,
    getWrecks,
    pushWreck,
    isInitialized
} from '../WreckStore'

/**
 * The first argument defines the way to resolve an ID to its object.
 * The second argument defines the way to resolve a node object to its GraphQL type.
 */
var { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        let { id, type } = fromGlobalId(globalId);
        if (type === 'WreckType') {
            console.log("Im here");
            return getById(id)
        } else if (type === "Viewer") {
            console.log("Im here getting vieweer");
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

export var GraphQLWreckType = new GraphQLObjectType({
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

export var {
    connectionType: WrecksConnection
    // ,edgeType: GraphQLSimTypesEdge,
} = connectionDefinitions({
    name: 'WreckType',
    nodeType: GraphQLWreckType
});

export var GraphQLViewer = new GraphQLObjectType({
    name: 'Viewer',
    fields: () => ({
        id: globalIdField('Viewer'),
        wrecks: {
            type: WrecksConnection,
            args: {...connectionArgs},
            resolve: (obj, {...args}) => {
                //
                // console.log("retrieving data ...");
                // console.log("is initialized : " + isInitialized());

                // if (isInitialized()) {
                //     console.log("data retrieved from cache : " + getWrecks().length);
                //     return connectionFromArray(getWrecks(), args)
                // }

                return Database.models.wreck.findAll()
                    .then((response) => {
                        console.log("data retrieved from remote : " + JSON.stringify(response.length));
                        initState(response);
                        return connectionFromArray(response, args)
                    });
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
                console.log("retrieving data by id : " + id);

                let wreck = getById(id);
                if (wreck !== undefined) {
                    console.log("data retrieved from cache.");
                    return wreck
                }

                return Database.models.wreck.findById(id)
                    .then((response) => {
                        console.log("data retrieved from remote : " + JSON.stringify(response));
                        pushWreck(response);
                        return response
                    });
            }
        }
    }),
    interfaces: [nodeInterface]
});

export var GraphQLRoot = new GraphQLObjectType({
    name: 'Root',
    fields: {
        viewer: {
            type: GraphQLViewer,
            resolve: () => getViewer
        },
        node: nodeField
    }
});


