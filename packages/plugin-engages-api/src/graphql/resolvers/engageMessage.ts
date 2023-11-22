import { IContext } from '../../connectionResolver';
import { IEngageMessageDocument } from '../../models/definitions/engages';
import { prepareSmsStats } from '../../telnyxUtils';
import { sendCoreMessage } from '../../messageBroker';

export default {
  async __resolveReference(
    { _id }: IEngageMessageDocument,
    _args,
    { models }: IContext
  ) {
    return models.EngageMessages.findOne({ _id });
  },

  async segments({ segmentIds = [] }: IEngageMessageDocument) {
    return segmentIds.map(segmentId => ({
      __typename: 'Segment',
      _id: segmentId
    }));
  },

  async brands({ brandIds = [] }: IEngageMessageDocument) {
    return brandIds.map(brandId => ({
      __typename: 'Brand',
      _id: brandId
    }));
  },

  async customerTags({ customerTagIds = [] }: IEngageMessageDocument) {
    return customerTagIds.map(customerTagId => ({
      __typename: 'Tag',
      _id: customerTagId
    }));
  },

  async fromUser({ fromUserId }: IEngageMessageDocument) {
    return { __typename: 'User', _id: fromUserId };
  },

  // common tags
  async getTags(engageMessage: IEngageMessageDocument) {
    return (engageMessage.tagIds || []).map(tagId => ({
      __typename: 'Tag',
      _id: tagId
    }));
  },

  async brand(engageMessage: IEngageMessageDocument) {
    const { messenger } = engageMessage;

    if (messenger && messenger.brandId) {
      return { __typename: 'Brand', _id: messenger.brandId };
    }

    return null;
  },

  async stats({ _id }: IEngageMessageDocument, _args, { models }: IContext) {
    return models.Stats.findOne({ engageMessageId: _id });
  },

  async smsStats({ _id }: IEngageMessageDocument, _args, { models }: IContext) {
    return prepareSmsStats(models, _id);
  },

  async fromIntegration(engageMessage: IEngageMessageDocument) {
    if (
      engageMessage.shortMessage &&
      engageMessage.shortMessage.fromIntegrationId
    ) {
      return {
        __typename: 'Integration',
        _id: engageMessage.shortMessage.fromIntegrationId
      };
    }

    return null;
  },

  async createdUserName(
    { createdBy = '' }: IEngageMessageDocument,
    _args,
    { subdomain }: IContext
  ) {
    const user = await sendCoreMessage({
      subdomain,
      action: 'users.findOne',
      data: {
        _id: createdBy
      },
      isRPC: true
    });

    if (!user) {
      return '';
    }

    return user.username || user.email || user._id;
  },

  async logs(
    engageMessage: IEngageMessageDocument,
    _args,
    { models }: IContext
  ) {
    return models.Logs.find({ engageMessageId: engageMessage._id }).lean();
  }
};
