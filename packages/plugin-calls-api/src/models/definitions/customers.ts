import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface ICustomer {
  inboxIntegrationId: string;
  primaryPhone: string | number;
  erxesApiId?: string;
}

export interface ICustomerDocument extends ICustomer, Document {}

export const customerSchema = new Schema<ICustomerDocument>({
  _id: field({ pkey: true }),
  erxesApiId: { type: String, label: 'Customer id at contacts-api' },
  primaryPhone: {
    type: String,
    unique: true,
    label: 'Call primary phone'
  },
  inboxIntegrationId: { type: String, label: 'Inbox integration id' }
});
