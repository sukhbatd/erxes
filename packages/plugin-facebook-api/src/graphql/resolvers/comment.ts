import { IContext } from '../../connectionResolver';
import { ICommentDocument } from '../../models/definitions/comments';

export default {
  async customer(comment: ICommentDocument, _args, { models }: IContext) {
    return models.Customers.findOne({ userId: comment.senderId });
  }
};
