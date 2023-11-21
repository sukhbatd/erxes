import { IResponseTemplateDocument } from '../../models/definitions/responseTemplates';

export default {
  async brand(responseTemplate: IResponseTemplateDocument) {
    return (
      responseTemplate.brandId && {
        __typename: 'Brand',
        _id: responseTemplate.brandId
      }
    );
  }
};
