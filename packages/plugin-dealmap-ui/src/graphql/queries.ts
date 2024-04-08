const list = /* GraphQL */ `
  query Dealmaps {
    dealmaps {
      _id
      completedStageId
      createdAt
      freeStageId
      name
      pendingStageId
      pipelineId
    }
  }
`;

const totalCount = `
  query dealmapsTotalCount{
    dealmapsTotalCount
  }
`;

export default {
  list,
  totalCount
};
