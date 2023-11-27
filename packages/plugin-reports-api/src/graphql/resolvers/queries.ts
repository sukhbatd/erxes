import { serviceDiscovery } from '../../configs';
import { IContext } from '../../connectionResolver';
import { sendCommonMessage } from '../../messageBroker';

const reportsQueries = {
  async reportsList(_root, {}, { models }: IContext) {
    const selector: any = {};
    const totalCount = await models.Reports.countDocuments(selector);

    const list = models.Reports.find(selector).sort({
      createdAt: 1,
      name: 1
    });

    return { list, totalCount };
  },

  async reportDetail(_root, { _id }, { models }: IContext) {
    return models.Reports.getReport(_id);
  },

  async chartsList(_root, {}, { models }: IContext) {
    const selector: any = {};
    const totalCount = models.Charts.countDocuments(selector);
    const list = models.Charts.find(selector).sort({ name: 1 });
    return { list, totalCount };
  },

  async chartDetail(_root, { _id }, { models }: IContext) {
    return models.Charts.getChart(_id);
  },

  async reportChartGetFilterTypes(
    _root,
    { serviceName, templateType },
    { models }: IContext
  ) {
    const service = serviceDiscovery.getService(serviceName);

    const templates = service.configs.meta.reports || {};

    let filterTypes = [];

    if (templates) {
      const template = templates.find(t => t.templateType === templateType);
      if (template) {
        filterTypes = template.filterTypes || [];
      }
    }

    return filterTypes;
  },

  async reportChartGetTemplates(_root, { serviceName }, { models }: IContext) {
    const service = await serviceDiscovery.getService(serviceName, true);

    const reportConfig = service.config.meta.reports || {};

    let templates = [];

    if (reportConfig) {
      templates = reportConfig.templates || [];
    }

    return templates;
  },

  async reportChartGetResult(
    _root,
    { serviceName, templateType, filter },
    { subdomain, user }: IContext
  ) {
    const reportResult = await sendCommonMessage({
      subdomain,
      serviceName,
      action: 'reports.getChartResult',
      data: {
        filter,
        templateType,
        currentUser: user
      },
      isRPC: true
    });

    return reportResult;
  }
};

export default reportsQueries;
