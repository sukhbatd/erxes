import { Document, Schema } from 'mongoose';
import { field } from './utils';
import { IString_id } from '@erxes/api-utils/src/types';
import { IPurposeTypeModel } from '../loanPurposeType';
export interface IPurposeType {
  name: string;
}

export type IPurposeTypeDb = IPurposeType & IString_id;

export type IPurposeTypeDocument = Document<string, {}, IPurposeTypeDb> & IPurposeTypeDb;

export const purposeTypeSchema = new Schema<IPurposeTypeDb, IPurposeTypeModel>({
  _id: field({ pkey: true }),
  name: field({ type: String })
});
