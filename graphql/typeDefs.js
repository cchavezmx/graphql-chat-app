const { gql } = require('apollo-server')

module.exports = gql`
# mutations
    type User {
        username: String!
        email: String!
        token: String
        createdAt: String!
    }

    type Query {
    getUser: [User]!
    login(username: String! password: String!): User!
    }

    type Mutation {
        register(username: String! email: String! password: String! confirmPassword: String!): User!
    }
`;


// para retornar una lista de algo, se necesita los braquets []
// : User! <== retorno
//  el ! es par decirle que es requerida 
 