import * as _ from 'underscore';
import { model } from 'mongoose';
import { Schema } from 'mongoose';

export const dealmapSchema = new Schema({
  name: String,
  createdAt: Date,
  freeStageId: String,
  pendingStageId: String,
  completedStageId: String,
  pipelineId: String
});

export const loadDealmapClass = () => {
  class Dealmap {
    public static async getDealmap(_id: string) {
      const dealmap = await Dealmaps.findOne({ _id });

      if (!dealmap) {
        throw new Error('Dealmap not found');
      }

      return dealmap;
    }

    // create
    public static async createDealmap(doc) {
      return Dealmaps.create({
        ...doc,
        createdAt: new Date()
      });
    }

    // update
    public static async updateDealmap(_id: string, doc) {
      await Dealmaps.updateOne({ _id }, { $set: { ...doc } }).then(err =>
        console.error(err)
      );
    }
    // remove
    public static async removeDealmap(_id: string) {
      return Dealmaps.deleteOne({ _id });
    }
  }

  dealmapSchema.loadClass(Dealmap);

  return dealmapSchema;
};

loadDealmapClass();

// tslint:disable-next-line
export const Dealmaps = model<any, any>('dealmaps', dealmapSchema);
