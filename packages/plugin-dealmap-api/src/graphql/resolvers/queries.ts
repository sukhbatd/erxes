import { IContext } from '../../connectionResolver';

const dealmapQueries = {
  dealmaps: async (_root, {}, { models }: IContext) => {
    const selector: any = {};

    return await models.Dealmap.find({});
  },

  dealmapsTotalCount(_root, _args, { models }: IContext) {
    return models.Dealmap.find({}).countDocuments();
  }
};

export default dealmapQueries;
