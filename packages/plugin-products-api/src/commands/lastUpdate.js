
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { prodInfos, catInfos } = require('./lastData')

dotenv.config();

// const { MONGO_URL } = process.env;
const MONGO_URL = 'mongodb://localhost/bto_main';

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
console.log(Boolean(client))
let db;
let ProductCategories;
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

  await ProductCategories.updateMany({}, { $set: { status: 'disabled' } });
  for (const catInfo of catInfos) {
    await ProductCategories.updateOne({ _id: catInfo._id }, { $set: { ...catInfo } }, { upsert: true });
  }

  const now = new Date();
  codes = [];

  for (const info of prodInfos) {
    const { _id, image, categoryCode, oldCode, code, oldCatCode } = info;

    let attachment;
    if (image) {
      attachment = {
        url: image,
        name: image,
        type: `image/jpg`,
        size: 405740
      }
    }
    const doc = {
      code: newCode,
      status: "active",
      categoryId: category._id,
      type: 'product',
      attachment,
      unitPrice: Number(info.unitPrice),

      barcodes: (info.barcodes || '').split(',').filter(b => b)
    };
    if (info.subUom) {
      const ratio = info.inBox ? 1 / Number(info.inBox) : Number(info.subRatio) || 1;
      doc.subUoms = [{ uom: info.subUom, ratio }];
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
      {
        "field": "ObM8zOdOzl2c5_l0RXSEt",
        "value": `${oldCatCode}`,
        "stringValue": `${oldCatCode}`,
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


    if (_id) {
      const productFId = await Products.find({ _id }).toArray();
      if (productFId.length !== 1) {
        console.log(`notFoundId: ${productFId.length} -- ${code} , ${_id} # ${oldCode}`)
        continue;
      }

      let category = await ProductCategories.findOne({ code: categoryCode });
      if (!category) {
        console.log(`category not found ${categoryCode} -- ${code} , ${_id}`)
        continue;
      }


      const productNewCode = await Products.find({ code: code }).toArray();
      if (productNewCode.length !== 0) {
        console.log(`newCode: ${productNewCode.length} -- ${code} , ${_id}`)
        continue;
      }


    } else {
      let category = await ProductCategories.findOne({ code: oldCatCode });
      if (!category) {
        console.log(`category not found ${categoryCode} -- ${code} , ${_id}`)
        continue;
      }

      const productNewCode = await Products.find({ code: code }).toArray();
      if (productNewCode.length !== 0) {
        console.log(`newCode: ${productNewCode.length} -- ${code} , ${_id}`)
        continue;
      }
    }

    await Products.updateOne({ _id }, { $set: { ...productInfo, customFieldsData } }, { upsert: true });
  }
  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
