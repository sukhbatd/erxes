import type { Model } from 'mongoose';
import {
  dealmapSchema,
  IDealmap,
  IDealmapDocument
} from './definitions/dealmap';
import { IModels } from '../connectionResolver';

export interface IDealmapModel extends Model<IDealmapDocument> {
  getDealmap(_id: string): Promise<IDealmapDocument>;
  createDealmap(doc: IDealmap): Promise<IDealmapDocument>;
  updateDealmap( _id: string, doc: IDealmap): Promise<IDealmapDocument>;
  removeDealmap(_id: string): Promise<IDealmapDocument>;
}

export const loadDealmapClass = (models: IModels, subdomain: string) => {
  class Dealmap {
    public static async getDealmap(_id: string) {
      const dealmap = await models.Dealmap.findOne({ _id }).lean();

      if (!dealmap) {
        throw new Error('Dealmap not found');
      }

      return dealmap;
    }

    // create
    public static async createDealmap(doc) {
      const dealmap = await models.Dealmap.create({
        ...doc,
        createdAt: new Date()
      });

      return dealmap;
    }

    // update
    public static async updateDealmap(_id: string, doc) {
      const current = await models.Dealmap.getDealmap(_id);
      if (current) {
        await models.Dealmap.updateOne(
          { _id },
          { $set: { ...doc, modifiedAt: new Date() } }
        ).then(err => console.error(err));
      }
      return models.Dealmap.findOne({ _id }).lean();
    }
    // remove
    public static async removeDealmap(_id: string) {
      return await models.Dealmap.deleteOne({ _id }).lean();
    }
  }

  dealmapSchema.loadClass(Dealmap);

  return dealmapSchema;
};
