
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { data, newCategories } = require('./dataNextCheck')

dotenv.config();

// const { MONGO_URL } = process.env;
const MONGO_URL = 'mongodb://localhost/bto_test';

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
console.log(client)
let db;
let ProductCategories;
let Products;

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

  notFoundImages = [];

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');

  console.log(`Process start at: ${new Date()}`);

  const now = new Date();
  let successCount = 0;
  let reSkipCount = 0;

  for (const catInfo of newCategories) {
    const checkCat = await ProductCategories.findOne({ code: catInfo.code });
    if (checkCat) {
      continue;
    }

    const parentCat = await ProductCategories.findOne({ code: catInfo.parentCode });

    await ProductCategories.insertOne({ code: catInfo.code, name: catInfo.name, parentId: parentCat ? parentCat._id : '' })
  }

  for (const info of data) {
    const { categoryCode, oldCode, newCode } = info;

    let category = await ProductCategories.findOne({ code: categoryCode });

    if (!category) {
      console.log(`category not found ${categoryCode}`)
      continue;
    }

    const oldFieldProduct = await Products.findOne({ 'customFieldsData.field': 'g5BEvd5wBQxi88hTM', 'customFieldsData.value': oldCode }) || {};
    const oldProduct = await Products.findOne({ code: oldCode }) || oldFieldProduct || {};
    let dupProduct = await Products.findOne({ code: newCode }) || {};

    if (oldFieldProduct._id === dupProduct._id && dupProduct._id) {
      reSkipCount += 1;
      continue;
    }

    if (!oldProduct._id) {
      console.log(oldCode, 'skipped')
      continue;
    }

    if (oldProduct._id === dupProduct._id) {
      continue;
    }

    if (dupProduct._id) {
      // huraaj baigaad daraa ni dahin shalgaj ajilluulah
      if (dupProduct.status !== 'deleted') {
        console.log('-----------', oldProduct.code, dupProduct.code)
        continue;
      }
      await Products.updateOne({ _id: dupProduct._id }, { $set: { code: `${dupProduct.code}<>`, temp: 'deletedToUdate' } });
      dupProduct = await Products.findOne({ code: newCode }) || {};
    }

    const doc = {
      ...info,
      code: newCode,
      status: "active",
      categoryId: category._id,
      type: 'product',
      unitPrice: Number(info.unitPrice),
      barcodes: (info.barcodes || '').split(',').filter(b => b)
    };

    let customFieldsData = [
      {
        "field": "g5BEvd5wBQxi88hTM",
        "value": `${oldCode}`,
        "stringValue": `${oldCode}`,
        "numberValue": null
      },
    ];

    let _id;
    let productInfo = {};

    // oldProduct to update
    _id = oldProduct._id
    productInfo = { ...oldProduct, ...doc, temp: 'nextCheckUpdate' }
    customFieldsData = customFieldsData.concat((oldProduct.customFieldsData || []).filter(cfd => !['g5BEvd5wBQxi88hTM'].includes(cfd.field)))

    await Products.updateOne({ _id }, { $set: { ...productInfo, customFieldsData } }, { upsert: true });
    successCount = successCount + 1;
  }

  console.log('successCount: ', successCount, 'reSkipCount: ', reSkipCount)
  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
