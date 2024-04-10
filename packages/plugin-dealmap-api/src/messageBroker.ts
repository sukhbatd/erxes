import {
  consumeQueue,
  consumeRPCQueue
} from '@erxes/api-utils/src/messageBroker';

export const setupMessageConsumers = async () => {
  consumeQueue('dealmap:send', async ({ data }) => {
    return {
      status: 'success'
    };
  });

  consumeRPCQueue('dealmap:find', async ({ data }) => {
    return {
      status: 'success'
    };
  });
};
