import * as mongoose from 'mongoose';

import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';

import { ICommentModel, loadCommentClass } from './models/Comments';
import { ICommentDocument } from './models/definitions/comments';

import {
  IConversationModel,
  loadConversationClass
} from './models/Conversations';
import { IConversationDocument } from './models/definitions/conversations';

import { ICustomerModel, loadCustomerClass } from './models/Customers';
import { ICustomerDocument } from './models/definitions/customers';

import { IConversationMessageDocument } from './models/definitions/conversationMessages';
import {
  IConversationMessageModel,
  loadConversationMessageClass
} from './models/ConversationMessages';
import {
  IAccountDocument,
  IAccountModel,
  loadAccountClass
} from './models/Accounts';
import {
  IConfigDocument,
  IConfigModel,
  loadConfigClass
} from './models/Configs';
import {
  IIntegrationDocument,
  IIntegrationModel,
  loadIntegrationClass
} from './models/Integrations';
import { ILogModel, loadLogClass } from './models/Logs';
import { ILogDocument } from './models/definitions/logs';

export interface IModels {
  Comments: ICommentModel;
  Conversations: IConversationModel;
  Customers: ICustomerModel;
  ConversationMessages: IConversationMessageModel;
  Accounts: IAccountModel;
  Configs: IConfigModel;
  Integrations: IIntegrationModel;
  Logs: ILogModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.Accounts = db.model<IAccountDocument, IAccountModel>(
    'instagram_accounts',
    loadAccountClass(models)
  );
  models.Configs = db.model<IConfigDocument, IConfigModel>(
    'instagram_configs',
    loadConfigClass(models)
  );
  models.Integrations = db.model<IIntegrationDocument, IIntegrationModel>(
    'instagram_integrations',
    loadIntegrationClass(models)
  );
  models.Logs = db.model<ILogDocument, ILogModel>('logs', loadLogClass(models));

  models.Comments = db.model<ICommentDocument, ICommentModel>(
    'comments_instagrams',
    loadCommentClass(models)
  );

  models.Conversations = db.model<IConversationDocument, IConversationModel>(
    'conversations_instagrams',
    loadConversationClass(models)
  );

  models.Customers = db.model<ICustomerDocument, ICustomerModel>(
    'customers_instagrams',
    loadCustomerClass(models)
  );

  models.ConversationMessages = db.model<
    IConversationMessageDocument,
    IConversationMessageModel
  >('conversation_messages_instagrams', loadConversationMessageClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
