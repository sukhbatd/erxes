import { IConversationMessageDocument } from '../../models/definitions/conversationMessages';

export default {
  async user(message: IConversationMessageDocument) {
    return message.userId && { __typename: 'User', _id: message.userId };
  },

  async customer(message: IConversationMessageDocument) {
    return (
      message.customerId && { __typename: 'Customer', _id: message.customerId }
    );
  }
};
