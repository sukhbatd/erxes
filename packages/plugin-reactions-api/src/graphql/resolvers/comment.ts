const Comment = {
  async createdUser(comment) {
    return (
      comment.createdBy && {
        __typename: 'User',
        _id: comment.createdBy
      }
    );
  },

  async childCount(comment, {}, { models }) {
    return models.Comments.find({
      parentId: comment._id
    }).countDocuments();
  }
};

export default Comment;
