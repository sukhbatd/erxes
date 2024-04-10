export interface IDealmap {
  _id: string;
  name: string;
  createdAt: string;
  freeStageId: string;
  pendingStageId: string;
  completedStageId: string;
  pipelineId: string;
}

export interface IType {
  _id: string;
  name: string;
}

// queries
export type DealmapQueryResponse = {
  dealmaps: IDealmap[];
  refetch: () => void;
  loading: boolean;
};
export type TypeQueryResponse = {
  dealmapTypes: IType[];
  refetch: () => void;
  loading: boolean;
};

// mutations
export type MutationVariables = {
  _id?: string;
  name: string;
  createdAt?: Date;
  expiryDate?: Date;
  checked?: boolean;
  type?: string;
};
export type AddMutationResponse = {
  addMutation: (params: { variables: MutationVariables }) => Promise<any>;
};

export type EditMutationResponse = {
  editMutation: (params: { variables: MutationVariables }) => Promise<any>;
};

export type RemoveMutationResponse = {
  removeMutation: (params: { variables: { _id: string } }) => Promise<any>;
};

export type EditTypeMutationResponse = {
  typesEdit: (params: { variables: MutationVariables }) => Promise<any>;
};

export type RemoveTypeMutationResponse = {
  typesRemove: (params: { variables: { _id: string } }) => Promise<any>;
};
