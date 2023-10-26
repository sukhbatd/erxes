import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { serviceDiscovery } from '../../../configs';
import { IContext } from '../../../connectionResolver';
import { paginate } from '@erxes/api-utils/src';

const generateFilter = async (params, commonQuerySelector) => {
  const filter: any = commonQuerySelector;

  if (params.searchValue) {
    filter.$or = [
      { name: { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] } },
      { code: { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] } },
      { number: { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] } }
    ];
  }

  // if (params.ids) {
  //   filter._id = { $in: params.ids };
  // }

  return filter;
};

export const sortBuilder = params => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};
const goalQueries = {
  /**
   * Goals list
   */

  // tslint:disable-next-line:no-empty
  async goals(_root, _args, { models }: IContext) {
    return await models.Goals.find({}).lean();
    // return paginate(
    //   models.Goals.find(
    //     await generateFilter(models, params, commonQuerySelector)
    //   ),
    //   {
    //     page: params.page,
    //     perPage: params.perPage
    //   }
    // );
  },
  goalTypes: async (
    _root,
    params,
    { commonQuerySelector, models }: IContext
  ) => {
    return paginate(
      models.Goals.find(await generateFilter(params, commonQuerySelector)),
      {
        page: params.page,
        perPage: params.perPage
      }
    );
  },

  /**
   * goalTypes for only main list
   */

  goalTypesMain: async (
    _root,
    params,
    { commonQuerySelector, models }: IContext
  ) => {
    const filter = await generateFilter(params, commonQuerySelector);

    const data = {
      list: paginate(models.Goals.find(filter).sort(sortBuilder(params)), {
        page: params.page,
        perPage: params.perPage
      }),
      totalCount: await models.Goals.find(filter).countDocuments()
    };

    return data;
  },

  goalTypeMainProgress: async (
    _root,
    params,
    { commonQuerySelector, models }: IContext
  ) => {
    const goals = await models.Goals.progressIdsGoals();

    return goals;
  },
  /**
   * Get one goal
   */
  async goalDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    const goal = await models.Goals.progressGoal(_id);
    return goal;
  }
};

// requireLogin(goalQueries, 'goalDetail');
// checkPermission(goalQueries, 'goals', 'showGoals', []);

export default goalQueries;
