import { IContext } from '../../connectionResolver';
import { IDealmap } from '../../models/definitions/dealmap';

const dealmapMutations = {
  /**
   * Creates a new dealmap
   */
  async dealmapsAdd(_root, doc, { models }: IContext) {
    return await models.Dealmap.createDealmap(doc);
  },
  /**
   * Edits a new dealmap
   */
  async dealmapsEdit(_root, { _id, ...doc }, { models }: IContext) {
    return await models.Dealmap.updateDealmap(_id, doc as IDealmap);
  },
  /**
   * Removes a single dealmap
   */
  async dealmapsRemove(_root, { _id }, { models }: IContext) {
    return models.Dealmap.removeDealmap(_id);
  }
};

export default dealmapMutations;
