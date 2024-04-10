import * as mongoose from 'mongoose';
import { IDealmapModel, loadDealmapClass } from './models/dealmap';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { IDealmapDocument } from './models/definitions/dealmap';
import { createGenerateModels } from '@erxes/api-utils/src/core';

export interface IModels {
  Dealmap: IDealmapModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string
): IModels => {
  const models = {} as IModels;

  models.Dealmap = db.model<IDealmapDocument, IDealmapModel>(
    'dealmaps',
    loadDealmapClass(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
