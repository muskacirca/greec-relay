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
        imagePath: {type: GraphQLString},
        file: {type: GraphQLString}
    },
    outputFields: {
        wreck: {
            type: GraphQLWreckType,
            resolve: (rootvalue) => {
                
              //  const file = rootvalue.request.file;

                return {}
            }
        }
    },
    mutateAndGetPayload: (wreck) => {

        console.log("yoooo : " + JSON.stringify(wreck));

        if(wreck.imagePath) {
            let imageName = wreck.file.substring(0, wreck.file.lastIndexOf('.'));
            let mimeType = wreck.file.substring(wreck.file.lastIndexOf('.'));
            console.log("imageName : " + JSON.stringify(imageName));
            console.log("mineType : " + JSON.stringify(mimeType));
        }

        if(!wreck.id) {
            console.log("creating : " + JSON.stringify(wreck));
            return Database.models.wreck.create(wreck).then(r => r)
        } else {
            wreck.id = fromGlobalId(wreck.id).id;
            wreck.imagePath = wreck.file;
            console.log("updating : " + JSON.stringify(wreck));
            return Database.models.wreck.update(wreck, {where: {id: wreck.id}}).then(r => {
                console.log("r : " + JSON.stringify(r));
                return r
            })
        }
    }
});
