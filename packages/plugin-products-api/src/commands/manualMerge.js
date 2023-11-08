
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { data, images } = require('./dataChecked')

dotenv.config();

const { MONGO_URL } = process.env;
const { FROM_MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
const fromClient = new MongoClient(FROM_MONGO_URL);

let db;
let ProductCategories;
let Products;
let Companies;
let FProductCategories;
let FProducts;
let FCompanies;

const command = async () => {
  await client.connect();
  console.log(Boolean(client), Boolean(fromClient))
  db = client.db();
  fdb = fromClient.db();
  console.log(Boolean(db))
  console.log(Boolean(fdb))

  notFoundImages = [];

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');
  Companies = db.collection('companies');
  FProductCategories = fdb.collection('product_categories');
  FProducts = fdb.collection('products');
  FCompanies = fdb.collection('companies');

  console.log(`Process start at: ${new Date()}`);

  const now = new Date();
  let successCount = 0;

  for (const info of data) {
    const { categoryCode, imageName, oldCode, newCode } = info;
    const imgFullName = imageName && images.includes(imageName) ? `butenorgil/${info.imageName}` : ''

    let attachment;
    if (imgFullName) {
      attachment = {
        url: imgFullName,
        name: imgFullName,
        type: `image/jpg`,
        size: 405740
      }
    }

    let category = await ProductCategories.findOne({ code: categoryCode });

    if (!category) {
      console.log(`category not found ${categoryCode}`)
      continue;
    }

    const oldProduct = await Products.findOne({'customFieldsData.field': 'g5BEvd5wBQxi88hTM', 'customFieldsData.value': oldCode }) || await Products.findOne({ code: oldCode }) || {};
    const dupProduct = await Products.findOne({ code: newCode }) || {};

    if (oldProduct._id === dupProduct._id) {
      continue;
    }

    if (oldProduct._id && dupProduct._id) {
      // huraaj baigaad daraa ni dahin shalgaj ajilluulah
      if (dupProduct.status === 'deleted') {
        await Products.updateOne({ _id: dupProduct._id }, { $set: { code: `${dupProduct.code}<>` } });
      }
      console.log('-----------', oldProduct.code, dupProduct.code)
      continue;
    }

    const doc = {
      ...info,
      code: newCode,
      status: "active",
      categoryId: category._id,
      type: 'product',
      attachment,
      unitPrice: Number(info.unitPrice),

      barcodes: (info.barcodes || '').split(',').filter(b => b)
    };

    if (info.subUom) {
      doc.subUoms = [{ uom: info.subUom, ratio: 1 / Number(info.ratio || 1) }];
    }

    if (info.vendorName) {
      let company = await Companies.findOne({ primaryName: info.vendorName });
      if (!(company && company._id)) {
        await Companies.insertOne({
          _id: nanoid(), primaryName: info.vendorName, code: info.vendorCode, names: [info.vendorName], searchText: `${info.vendorName} ${info.vendorCode}`,
          emails: [], phones: [], status: 'active', scopeBrandIds: [], customFieldsData: [], description: '', primaryPhone: '', primaryEmail: '', trackedData: [],
          createdAt: now, modifiedAt: now, tagIds: []
        })
        company = await Companies.findOne({ primaryName: info.vendorName });
      }
      doc.vendorId = company._id;
    }

    let customFieldsData = [
      {
        "field": "g5BEvd5wBQxi88hTM",
        "value": `${oldCode}`,
        "stringValue": `${oldCode}`,
        "numberValue": null
      },
    ];

    if (info.jin) {
      customFieldsData.push({
        "field": "vSprymxcavTi5vB98",
        "value": Number(info.jin),
        "stringValue": `${info.jin}`,
        "numberValue": Number(info.jin)
      })
    }

    let _id;
    let productInfo = {};

    if (!oldProduct._id && !dupProduct._id) {
      // new product
      _id = nanoid();
      doc.createdAt = now;
      productInfo = { ...doc };
    }

    if (oldProduct._id && !dupProduct._id) {
      // oldProduct to update
      _id = oldProduct._id
      productInfo = { ...oldProduct, ...doc }
      customFieldsData = customFieldsData.concat((oldProduct.customFieldsData || []).filter(cfd => !['g5BEvd5wBQxi88hTM', 'vSprymxcavTi5vB98'].includes(cfd.field)))
    }

    if (!oldProduct._id && dupProduct._id) {
      // update dupProduct 
      _id = dupProduct._id
      productInfo = { ...dupProduct, ...doc }
      customFieldsData = customFieldsData.concat((dupProduct.customFieldsData || []).filter(cfd => !['g5BEvd5wBQxi88hTM', 'vSprymxcavTi5vB98'].includes(cfd.field)))
    }

    await Products.updateOne({ _id }, { $set: { ...productInfo, customFieldsData } }, { upsert: true });
    successCount = successCount + 1;
  }
  console.log('notFoundImages', notFoundImages)
  console.log('successCount', successCount)
  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
