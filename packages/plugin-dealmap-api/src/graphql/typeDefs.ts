import gql from 'graphql-tag';

const types = `
  type Dealmap {
    _id: String!
    name: String
    createdAt:Date
    freeStageId: String
    pendingStageId: String
    completedStageId: String
    pipelineId: String
  }
`;

const queries = `
  dealmaps: [Dealmap]
  dealmapsTotalCount: Int
`;

const params = `
  name: String,
`;

const mutations = `
  dealmapsAdd(${params}): Dealmap
  dealmapsRemove(_id: String!): JSON
  dealmapsEdit(_id:String!, ${params}): Dealmap
`;

const typeDefs = async () => {
  return gql`
    scalar JSON
    scalar Date

    ${types}
    
    extend type Query {
      ${queries}
    }
    
    extend type Mutation {
      ${mutations}
    }
  `;
};

export default typeDefs;
