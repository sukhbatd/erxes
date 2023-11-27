import { INotificationDocument } from '../../models/definitions/notifications';

export default {
  async createdUser(notif: INotificationDocument) {
    return (
      notif.createdUser && {
        __typename: 'User',
        _id: notif.createdUser
      }
    );
  }
};
