import { isEnabled } from '@erxes/ui/src/utils/core';

const paramDefs = `$kind: String`;
const params = `kind: $kind`;

const commentsParamDefs = `$conversationId: String!, $isResolved: Boolean, $commentId: String, $senderId: String, $skip: Int, $limit: Int`;
const commentsParams = `conversationId: $conversationId, isResolved: $isResolved, commentId: $commentId, senderId: $senderId, skip: $skip, limit: $limit`;

const commonCommentAndMessageFields = `
  content
  conversationId
`;

const commonPostAndCommentFields = `
  postId
  recipientId
  senderId
  erxesApiId
  attachments
  timestamp
  permalink_url
  content
`;

const instagramGetConfigs = `
  query instagramGetConfigs {
    instagramGetConfigs
  }
`;

const instagramGetIntegrations = `
  query instagramGetIntegrations(${paramDefs}) {
    instagramGetIntegrations(${params})
  }
`;

const instagramGetIntegrationDetail = `
  query instagramGetIntegrationDetail($erxesApiId: String) {
    instagramGetIntegrationDetail(erxesApiId: $erxesApiId)
  }
`;

const instagramGetComments = `
  query instagramGetComments(${commentsParamDefs}) {
    instagramGetComments(${commentsParams}) {
      ${commonCommentAndMessageFields}
      ${commonPostAndCommentFields}
      commentId
      parentId
      customer {
        _id
        firstName
        lastName
        profilePic
      }
      commentCount
      isResolved
    }
  }
`;

const instagramGetCommentCount = `
  query instagramGetCommentCount($conversationId: String!, $isResolved: Boolean) {
    instagramGetCommentCount(conversationId: $conversationId, isResolved: $isResolved)
  }
`;

const instagramGetPages = `
  query instagramGetPages($accountId: String!, $kind: String!) {
    instagramGetPages(accountId: $accountId, kind: $kind)
  }
`;

const instagramGetAccounts = `
  query instagramGetAccounts(${paramDefs}) {
    instagramGetAccounts(${params})
  }
`;

const instagramConversationMessages = `
  query instagramConversationMessages(
    $conversationId: String!
    $skip: Int
    $limit: Int
    $getFirst: Boolean
  ) {
    instagramConversationMessages(
      conversationId: $conversationId,
      skip: $skip,
      limit: $limit,
      getFirst: $getFirst
    ) {
      _id
      ${commonCommentAndMessageFields}
      customerId
      userId
      createdAt
      isCustomerRead
      internal

      attachments {
        url
        name
        type
        size
      }

      user {
        _id
        username
        details {
          avatar
          fullName
          position
        }
      }
      ${
        isEnabled('contacts')
          ? `
          customer {
            _id
            avatar
            firstName
            middleName
            lastName
            primaryEmail
            primaryPhone
            state
            companies {
              _id
              primaryName
              website
            }

            customFieldsData
            tagIds
          }
        `
          : ``
      }
    }
  }
`;

const instagramConversationMessagesCount = `
  query instagramConversationMessagesCount($conversationId: String!) {
    instagramConversationMessagesCount(conversationId: $conversationId)
  }
`;

const instagramHasTaggedMessages = `
  query instagramHasTaggedMessages($conversationId: String!) {
    instagramHasTaggedMessages(conversationId: $conversationId)
  }
`;

export default {
  instagramGetConfigs,
  instagramGetIntegrations,
  instagramGetIntegrationDetail,
  instagramGetComments,
  instagramGetCommentCount,
  instagramGetPages,
  instagramGetAccounts,
  instagramConversationMessages,
  instagramConversationMessagesCount,
  instagramHasTaggedMessages
};
