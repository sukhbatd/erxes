export interface IDealmap {
  _id: String;
  name: String;
  createdAt: Date;
  freeStageId: String;
  pendingStageId: String;
  completedStageId: String;
  pipelineId: String;
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
