
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


    // oldCode oor baraa oldoh yostoi ingej baij erxes deer sanaa ul zovoh
    // new Code oor baraa oldohgui baival sain
    // if _id ? update : create
    // create hiihed oldCode newCode bodoh


    if (codes.includes(code)) {
      console.log('aaaaaa dupl code', code)
    } else {
      codes.push(code)
    }

    if (_id) {
      let category = await ProductCategories.findOne({ code: categoryCode });
      if (!category) {
        console.log(`category not found ${categoryCode} -- ${code} , ${_id}`)
        continue;
      }
      if (category.status !== 'active') {
        ProductCategories.updateOne({ _id: category._id }, { $set: { status: 'active' } });
      }

      if (oldCode.includes(',')) {
        for (const oc of oldCode.replace(/, /g, ',').split(',')) {
          const productOldCode = await Products.find({ code: oc }).toArray();
          if (productOldCode.length !== 1) {
            console.log(`oldCode: ${productOldCode.length} -- ${code} , ${_id} # ${oc}`)
          }
        }
      } else {
        const productOldCode = await Products.find({ code: oldCode }).toArray();
        if (productOldCode.length !== 1) {
          console.log(`oldCodez: ${productOldCode.length} -- ${code} , ${_id} # ${oldCode}`)
        }
      }

      const productFId = await Products.find({ _id }).toArray();
      if (productFId.length !== 1) {
        console.log(`notFoundId: ${productFId.length} -- ${code} , ${_id} # ${oldCode}`)
      }

      const productNewCode = await Products.find({ code: code }).toArray();
      if (productNewCode.length !== 0) {
        console.log(`newCode: ${productNewCode.length} -- ${code} , ${_id}`)
      }
    } else {
      let category = await ProductCategories.findOne({ code: oldCatCode });
      if (!category) {
        console.log(`category not found ${categoryCode} -- ${code} , ${_id}`)
        continue;
      }
      if (category.status !== 'active') {
        ProductCategories.updateOne({ _id: category._id }, { $set: { status: 'active' } });
      }

      const productOldCode = await Products.find({ code: oldCode }).toArray();
      if (productOldCode.length !== 1) {
        console.log(`oldCode: ${productOldCode.length} -- ${code} , ${_id}`)
      }

      const productNewCode = await Products.find({ code: code }).toArray();
      if (productNewCode.length !== 0) {
        console.log(`newCode: ${productNewCode.length} -- ${code} , ${_id}`)
      }
    }

  }
  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
