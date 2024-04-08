import { IContext } from '@erxes/api-utils/src/types';

const dealmapQueries = {
  dealmaps: async (_root, {}, { models }: IContext) => {
    const selector: any = {};

    return await models.Dealmaps.find({});
  },

  dealmapsTotalCount(_root, _args, { models }: IContext) {
    return models.Dealmaps.find({}).countDocuments();
  }
};

export default dealmapQueries;
