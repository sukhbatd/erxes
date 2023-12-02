
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { prodInfos } = require('./sampleData')

dotenv.config();

// const { MONGO_URL } = process.env;
// const MONGO_URL = 'mongodb://admin:yvuFebaxGZkcYMc3rr6831Bbi@157.245.60.77:27017/erxes?authSource=admin&replicaSet=rs0';
const MONGO_URL = 'mongodb://localhost/bto_main';

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
console.log(Boolean(client))
let db;
let Products;
let Companies;

const nanoid = (len = 21) => {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let randomString = '';

  for (let i = 0; i < len; i++) {
    const position = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(position, position + 1);
  }

  return randomString;
};

const command = async () => {
  await client.connect();
  console.log(Boolean(client))
  db = client.db();
  console.log(Boolean(db))

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');
  Companies = db.collection('companies');

  console.log(`Process start at: ${new Date()}`);

  const now = new Date();
  codes = [];

  for (const info of prodInfos) {
    const { _id, name, jin, uom, subUom, subRatio, inBox, image, vendorCode = '', vendorName } = info;

    if (!_id) {
      continue;
    }

    const product = await Products.findOne({ _id });
    if (!product) {
      console.log('product not found', _id);
      continue;
    }

    productDoc = {
      uom,
      status: 'active'
    }

    if (vendorName) {
      let company = await Companies.findOne({ primaryName: vendorName });
      if (!(company && company._id)) {
        await Companies.insertOne({
          _id: nanoid(), primaryName: vendorName, code: vendorCode, names: [vendorName], searchText: `${vendorName} ${vendorCode}`,
          emails: [], phones: [], status: 'active', scopeBrandIds: [], customFieldsData: [], description: '', primaryPhone: '', primaryEmail: '', trackedData: [],
          createdAt: now, modifiedAt: now, tagIds: []
        })
        company = await Companies.findOne({ primaryName: vendorName });
      }
      productDoc.vendorId = company._id;
    }

    if (subUom) {
      const ratio = inBox ? 1 / Number(inBox) : Number(subRatio) || 1;
      productDoc.subUoms = [{ uom: subUom, ratio }];
    }

    let customFieldsData = product.customFieldsData;

    if (jin) {
      customFieldsData = customFieldsData.filter(cfd => cfd.field !== 'vSprymxcavTi5vB98').concat([{
        "field": "vSprymxcavTi5vB98",
        "value": Number(jin),
        "stringValue": `${jin}`,
        "numberValue": Number(jin)
      }])
    }

    productDoc.name = name;
    productDoc.attachment = {
      url: image,
      name: image,
      type: `image/jpg`,
      size: 405740
    };

    await Products.updateOne({ _id }, { $set: { ...productDoc, customFieldsData } });

  }
  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
