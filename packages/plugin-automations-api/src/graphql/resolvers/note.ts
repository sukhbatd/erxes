import { INoteDocument } from '../../models/definitions/notes';

export default {
  async createdUser(note: INoteDocument) {
    return (
      note.createdBy && {
        __typename: 'User',
        _id: note.createdBy
      }
    );
  }
};
