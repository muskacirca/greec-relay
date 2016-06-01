import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql'

import {
    AddOrUpdateWreckMutation,
} from './wrecks/WrecksMutation'

import {
    GraphQLRoot
} from './wrecks/WreckModel'



const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Mother of all mutations',
    fields() {
        return {
            addOrUpdateWreck: AddOrUpdateWreckMutation
        }
    }
})

export var Schema = new GraphQLSchema({
    query: GraphQLRoot,
    mutation: Mutations
});
