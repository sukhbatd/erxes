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

const totalCount = /* GraphQL */ `
  query dealmapsTotalCount {
    dealmapsTotalCount
  }
`;

const boards = /* GraphQL */ `
  query Boards($type: String!) {
    boards(type: $type) {
      _id
      name
    }
  }
`;

const pipelines = /* GraphQL */ `
  query Pipelines($boardId: String, $type: String, $isAll: Boolean) {
    pipelines(boardId: $boardId, type: $type, isAll: $isAll) {
      _id
      name
    }
  }
`;

const stages = /* GraphQL */ `
  query Stages($isAll: Boolean, $pipelineId: String) {
    stages(isAll: $isAll, pipelineId: $pipelineId) {
      _id
      name
    }
  }
`;

export default {
  list,
  totalCount,
  boards,
  pipelines,
  stages
};
