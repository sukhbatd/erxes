import { Dealmaps } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const dealmapMutations = {
  /**
   * Creates a new dealmap
   */
  async dealmapsAdd(_root, doc, _context: IContext) {
    return Dealmaps.createDealmap(doc);
  },
  /**
   * Edits a new dealmap
   */
  async dealmapsEdit(_root, { _id, ...doc }, _context: IContext) {
    return Dealmaps.updateDealmap(_id, doc);
  },
  /**
   * Removes a single dealmap
   */
  async dealmapsRemove(_root, { _id }, _context: IContext) {
    return Dealmaps.removeDealmap(_id);
  }
};

export default dealmapMutations;
