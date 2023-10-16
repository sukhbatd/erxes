import {
  IAttachment,
  MutationVariables,
  QueryResponse
} from '@erxes/ui/src/types';
export interface IGoalTypeDoc {
  createdAt?: Date;
  entity: string;
  contributionType: string;
  chooseBoard: string;
  frequency: string;
  metric: string;
  goalType: string;
  contribution: string;
  chooseStage: string;
  startDate: string;
  endDate: string;
  target: string;
}

export interface IPipeline {
  _id: string;
  name: string;
  boardId: string;
  tagId?: string;
  visibility: string;
  status: string;
  createdAt: Date;
  members?: any[];
  departmentIds?: string[];
  memberIds?: string[];
  condition?: string;
  label?: string;
  bgColor?: string;
  isWatched: boolean;
  startDate?: Date;
  endDate?: Date;
  metric?: string;
  hackScoringType?: string;
  templateId?: string;
  state?: string;
  itemsTotalCount?: number;
  isCheckUser?: boolean;
  isCheckDepartment?: boolean;
  excludeCheckUserIds?: string[];
  numberConfig?: string;
  numberSize?: string;
}
export interface IBoard {
  _id: string;
  name: string;
  pipelines?: IPipeline[];
}
export interface IGoalType extends IGoalTypeDoc {
  _id: string;
}

// mutation types

export type EditMutationResponse = {
  goalTypesEdit: (params: { variables: IGoalType }) => Promise<any>;
};

export type BoardsQueryResponse = {
  boards: IBoard[];
} & QueryResponse;

export type RemoveMutationVariables = {
  goalTypeIds: string[];
};

export type RemoveMutationResponse = {
  goalTypesRemove: (params: {
    variables: RemoveMutationVariables;
  }) => Promise<any>;
};

export type MergeMutationVariables = {
  goalTypeIds: string[];
  goalTypeFields: any;
};

export type MergeMutationResponse = {
  goalTypesMerge: (params: {
    variables: MergeMutationVariables;
  }) => Promise<any>;
};

export type AddMutationResponse = {
  goalTypesAdd: (params: { variables: IGoalTypeDoc }) => Promise<any>;
};

// query types

export type ListQueryVariables = {
  page?: number;
  perPage?: number;
  ids?: string[];
  searchValue?: string;
  sortField?: string;
  sortDirection?: number;
};

type ListConfig = {
  name: string;
  label: string;
  order: number;
};
export interface IStage {
  _id: string;
  name: string;
  type: string;
  probability: string;
  index?: number;
  itemId?: string;
  unUsedAmount?: any;
  amount?: any;
  itemsTotalCount: number;
  formId: string;
  pipelineId: string;
  visibility: string;
  memberIds: string[];
  canMoveMemberIds?: string[];
  canEditMemberIds?: string[];
  departmentIds: string[];
  status: string;
  order: number;
  code?: string;
  age?: number;
  defaultTick?: boolean;
}
export type StagesQueryResponse = {
  stages: IStage[];
  loading: boolean;
  refetch: ({ pipelineId }: { pipelineId?: string }) => Promise<any>;
};
export type PipelinesQueryResponse = {
  pipelines: IPipeline[];
  loading: boolean;
  refetch: ({
    boardId,
    type
  }: {
    boardId?: string;
    type?: string;
  }) => Promise<any>;
};
export type MainQueryResponse = {
  goalTypesMain: { list: IGoalType[]; totalCount: number };
  loading: boolean;
  refetch: () => void;
};

export type GoalTypesQueryResponse = {
  goalTypes: IGoalType[];
  loading: boolean;
  refetch: () => void;
};

export type ListConfigQueryResponse = {
  fieldsDefaultColumnsConfig: ListConfig[];
  loading: boolean;
};

export type DetailQueryResponse = {
  goalTypeDetail: IGoalType;
  loading: boolean;
};

export type CountQueryResponse = {
  loading: boolean;
  refetch: () => void;
};
