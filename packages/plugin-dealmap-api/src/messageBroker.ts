
import { consumeQueue, consumeRPCQueue } from '@erxes/api-utils/src/messageBroker';
import { Dealmaps } from "./models";

export const setupMessageConsumers = async () => {
  consumeQueue('dealmap:send', async ({ data }) => {
    Dealmaps.send(data);

    return {
      status: 'success',
    };
  });

  consumeRPCQueue('dealmap:find', async ({ data }) => {
    return {
      status: 'success',
      data: await Dealmaps.find({})
    };
  });
};
