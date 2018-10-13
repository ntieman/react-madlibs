const { gql } = require('apollo-server');

const typedefs = gql`
    type Token {
        id: ID
        placeholder: String
        description: String
        start: Int
        end: Int
        value: String
    }
    
    type MadLib {
        id: ID
        title: String
        text: String
        tokens: [Token]
    }
    
    type Song {
        name: String
        file: String
        uri: String
    }
    
    type Word {
        type: String
        word: String
    }
    
    type Query {
        madLib(id: ID!): MadLib
        madLibByTitle(title: String!): MadLib
        madLibs: [MadLib]
        song(name: String!): Song
        songs: [Song]
        words: [Word]
        wordsByType(type: String!): [Word]
    }
    
    type Mutation {
        newMadLib(title: String!, text: String!): MadLib
    }
`;

module.exports = typedefs;
