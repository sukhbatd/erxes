const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const amqplib = require('amqplib');
const { v4 } = require('uuid');
const uuid = v4;
const { codes } = require('./resaveData')

dotenv.config();

const MONGO_URL = 'mongodb://admin:yvuFebaxGZkcYMc3rr6831Bbi@157.245.60.77:27017/erxes?authSource=admin&replicaSet=rs0';

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
console.log(Boolean(client))
let db;
let Products;
let ProductCategories;


const sendRPCMessageMain = async (
  queueName,
  message
) => {
  queueName = queueName.concat(queuePrefix);

  console.log(`Sending rpc message ${JSON.stringify(message)} to queue ${queueName}`);

  const response = await new Promise((resolve, reject) => {
    const correlationId = uuid();

    return channel.assertQueue('', { exclusive: true }).then(q => {
      const timeoutMs = message.timeout || process.env.RPC_TIMEOUT || 590000;
      var interval = setInterval(() => {
        channel.deleteQueue(q.queue);

        clearInterval(interval);

        console.log(`${queueName} ${JSON.stringify(message)} timedout`);

        return resolve({ ...message.defaultValue, error: 'timedout' });
      }, timeoutMs);

      channel.consume(
        q.queue,
        msg => {
          clearInterval(interval);

          if (!msg) {
            channel.deleteQueue(q.queue).catch(() => { });
            return resolve(message?.defaultValue);
          }

          if (msg.properties.correlationId === correlationId) {
            const res = JSON.parse(msg.content.toString());

            if (res.status === 'success') {
              console.log(
                `RPC success response for queue ${queueName} ${JSON.stringify(
                  res
                )}`
              );
              resolve(res.data);
            } else {
              console.log(
                `RPC error response for queue ${queueName} ${res.errorMessage})}`
              );
              reject(new Error(res.errorMessage));
            }

            channel.deleteQueue(q.queue);
          }
        },
        { noAck: true }
      );

      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        correlationId,
        replyTo: q.queue,
        expiration: timeoutMs
      });
    });
  });

  return response;
};

function RabbitListener() { }

RabbitListener.prototype.connect = function (RABBITMQ_HOST) {
  const me = this;

  return new Promise(function (resolve) {
    amqplib
      .connect(RABBITMQ_HOST, { noDelay: true })
      .then(
        function (conn) {
          console.log(`Connected to rabbitmq server ${RABBITMQ_HOST}`);

          return conn.createChannel().then(function (chan) {
            channel = chan;
            resolve(chan);
          });
        },
        function connectionFailed(err) {
          console.log('Failed to connect to rabbitmq server', err);
          me.reconnect(RABBITMQ_HOST);
        }
      )
      .catch(function (error) {
        console.log('RabbitMQ: ', error);
      });
  });
};

const init = async ({ RABBITMQ_HOST, MESSAGE_BROKER_PREFIX }) => {
  const listener = new RabbitListener();
  await listener.connect(`${RABBITMQ_HOST}?heartbeat=60`);
  queuePrefix = MESSAGE_BROKER_PREFIX || '';

  return {
    sendRPCMessageMain
  };
};

const erkhetBroker = async () => {
  ERKHET_RABBITMQ_HOST = 'amqp://erkhet:2XmSaUfsXaYUeRR5EW6JLYeQAzQYNvgk@157.245.150.202:5672/erkhet';
  ERKHET_MESSAGE_BROKER_PREFIX = 'x15767';

  return await init({
    RABBITMQ_HOST: ERKHET_RABBITMQ_HOST,
    MESSAGE_BROKER_PREFIX: ERKHET_MESSAGE_BROKER_PREFIX
  });
};

let clientErkhet;

const sendRPCMessage = async (
  channel,
  message
) => {
  const response = await clientErkhet.sendRPCMessageMain(channel, message);
  return response;
};

const command = async () => {
  await client.connect();
  console.log(Boolean(client))
  db = client.db();
  console.log(Boolean(db))

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');

  clientErkhet = await erkhetBroker()
  console.log(Boolean(clientErkhet))

  console.log(`Process start at: ${new Date()}`);

  const products = await Products.find({ code: { $in: codes } }).toArray();

  const config = {
    costAccount: '610101',
    saleAccount: '510101',
    productCategoryCode: '1',
    apiToken: 'bto',
    apiKey: '0.8723972012851915',
    apiSecret: '0.8556180177032178'

  };

  for (const product of products) {
    productCategory = await ProductCategories.findOne({ _id: product.categoryId })
    const subUom = product.subUoms && product.subUoms.length ? product.subUoms[0] : {};

    const sendData = {
      action: 'update',
      oldCode: product.code,
      object: {
        code: product.code,
        name: product.name || '',
        measureUnit: product.uom,
        subMeasureUnit: subUom.uom,
        ratioMeasureUnit: subUom.ratio ? parseFloat(subUom.ratio) : undefined,
        barcodes: product.barcodes.join(','),
        unitPrice: product.unitPrice || 0,
        costAccount: config.costAccount,
        saleAccount: config.saleAccount,
        categoryCode: productCategory ? productCategory.code : '',
        defaultCategory: config.productCategoryCode,
        taxType: product.taxType,
        taxCode: product.taxCode
      }
    };

    const postData = {
      token: config.apiToken,
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      orderInfos: JSON.stringify(sendData)
    };

    const resp = await sendRPCMessage('rpc_queue:erxes-automation-erkhet', {
      action: 'product-change',
      payload: JSON.stringify(postData),
      thirdService: true
    });

    console.log(resp)
  }


  const now = new Date();
  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();

