const { gql } = require('apollo-server')

module.exports = gql`
# mutations
    type User {
        username: String!
        email: String
        token: String
        createdAt: String!
        latestMessage: Message
        imageUrl: String
    }
    type Message{
        from: String!
        to: String!
        content: String!
        uuid: String!
        createdAt: String!
    }
    
    type Query {
    getUser: [User]!
    login(username: String! password: String!): User!
    getMessages(from: String!): [Message]!
    }

    type Mutation {
        register(username: String! email: String! password: String! confirmPassword: String!): User!
        SendMessage(to: String! content: String!): Message!
    }
`;


// para retornar una lista de algo, se necesita los braquets []
// : User! <== retorno
//  el ! es par decirle que es requerida 
 