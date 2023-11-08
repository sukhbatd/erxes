const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { data, images } = require('./dataChecked')

dotenv.config();

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
let db;
let ProductCategories;
let Products;

const command = async () => {
  await client.connect();
  console.log(Boolean(client))
  db = client.db();
  console.log(Boolean(db))

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');

  const now = new Date();
  console.log(`Process start at: ${new Date()}`);

  const products = await Products.find({status: 'active'}).toArray()

  let noImage = 0;
  let wrongImages = [];
  let correctImages = [];

  for (const product of products) {
    if (!product.attachment || !product.attachment.url) {
      noImage += 1;
      continue;
    }

    const url = product.attachment.url;
    if (url.includes('butenorgil/')) {
      correctImages.push(url);
    } else {
      wrongImages.push(url);
    }
  }

  console.log(`Process finished at: ${now}`, noImage, wrongImages.length, correctImages.length);

  console.log(images.filter(i => !correctImages.includes(`butenorgil/${i}`)).join(', '))
  console.log(correctImages.filter(i => !images.includes(`${i.substring(11, 100)}`)).join(', '))
  console.log(wrongImages)

  process.exit();
};

command();
