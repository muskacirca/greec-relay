import {
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLString
} from 'graphql'

import {
    fromGlobalId,
    mutationWithClientMutationId,
} from 'graphql-relay'

import {
    GraphQLWreckType
} from './WreckModel'

import Database from '../db'

export const AddOrUpdateWreckMutation = new mutationWithClientMutationId({
    name: 'AddOrUpdateWreck',
    description: 'Function to add a comment to an item',
    inputFields: {
        id: {type: GraphQLString},
        name: {type: new GraphQLNonNull(GraphQLString)},
        latitude: {type: new GraphQLNonNull(GraphQLFloat)},
        longitude: {type: new GraphQLNonNull(GraphQLFloat)},
        shortDescription: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        sinkDate: {type: new GraphQLNonNull(GraphQLString)},
        imagePath: {type: GraphQLString}
    },
    outputFields: {
        wreck: {
            type: GraphQLWreckType,
            resolve: (wreck) => wreck
        }
    },
    mutateAndGetPayload: (wreck) => {

        console.log("yoooo : " + JSON.stringify(wreck));


        if(!wreck.id) {
            console.log("cearting : " + JSON.stringify(wreck));
            return Database.models.wreck.create(wreck).then(r => r)
        } else {
            wreck.id = fromGlobalId(wreck.id).id;
            console.log("updating : " + JSON.stringify(wreck));
            return Database.models.wreck.update(wreck, {where: {id: wreck.id}}).then(r => {
                console.log("r : " + JSON.stringify(r));
                return r
            })
        }
    }
});
