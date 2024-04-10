const add = /* GraphQL */ `
  mutation DealmapsAdd(
    $name: String
    $freeStageId: String
    $pendingStageId: String
    $completedStageId: String
    $boardId: String
    $pipelineId: String
  ) {
    dealmapsAdd(
      name: $name
      freeStageId: $freeStageId
      pendingStageId: $pendingStageId
      completedStageId: $completedStageId
      boardId: $boardId
      pipelineId: $pipelineId
    ) {
      _id
    }
  }
`;

const remove = /* GraphQL */ `
  mutation dealmapsRemove($_id: String!) {
    dealmapsRemove(_id: $_id)
  }
`;

const edit = /* GraphQL */ `
  mutation dealmapsEdit(
    $_id: String!
    $name: String
    $expiryDate: Date
    $checked: Boolean
    $typeId: String
  ) {
    dealmapsEdit(
      _id: $_id
      name: $name
      expiryDate: $expiryDate
      checked: $checked
      typeId: $typeId
    ) {
      _id
    }
  }
`;

export default {
  add,
  remove,
  edit
};
