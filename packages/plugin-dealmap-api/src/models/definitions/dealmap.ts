import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IDealmap {
  name: string;
  freeStageId: string;
  pendingStageId: string;
  completedStageId: string;
  pipelineId: string;
  boardId: string;
}

export interface IDealmapDocument extends IDealmap, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export const dealmapSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'name' }),
  freeStageId: field({ type: String, label: 'freeStageId' }),
  pendingStageId: field({ type: String, label: 'pendingStageId' }),
  boardId: field({ type: String, label: 'boardId' }),
  pipelineId: field({ type: String, label: 'pendingStageId' })
});
