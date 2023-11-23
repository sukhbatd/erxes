import { Document, Schema } from 'mongoose';
import { field } from './utils';
import { IPurposeTypeModel } from '../loanPurposeType';
export interface IPurposeType {
  _id: string;
  name: string;
}

export type IPurposeTypeDocument = Document<string, {}, IPurposeType> &
  IPurposeType;

export const purposeTypeSchema = new Schema<IPurposeType, IPurposeTypeModel>({
  _id: field({ pkey: true }),
  name: field({ type: String })
});
