const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { data, images } = require('./dataChecked')

dotenv.config();

const MONGO_URL = 'mongodb://localhost/bto_test';
const MAIN_MONGO_URL = 'mongodb://localhost/bto_main';

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
const mainClient = new MongoClient(MAIN_MONGO_URL);

let db;
let ProductCategories;
let Products;
let MProducts;

const command = async () => {
  await client.connect();
  await mainClient.connect();
  console.log(Boolean(client), Boolean(mainClient))
  db = client.db();
  mdb = mainClient.db();
  console.log(Boolean(db))
  console.log(Boolean(mdb))

  notFoundImages = [];

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');
  Companies = db.collection('companies');
  MProducts = mdb.collection('products');

  console.log(`Process start at: ${new Date()}`);

  const now = new Date();
  const mProducts = await MProducts.find({}).toArray();

  for (const mProd of mProducts) {
    let product = await Products.findOne({ _id: mProd._id });

    if (product) {
      continue;
    }

    product = await Products.findOne({ code: mProd.code });
    if (product) {
      console.log('code dup: ', mProd.code, ((product.customFieldsData || []).find(cf => cf.field === 'g5BEvd5wBQxi88hTM') || {}).value || '');
      continue;
    }

    await Products.insertOne({ _id: mProd._id, ...mProd, status: 'deleted', temp: 'recovery' });
  }

  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
