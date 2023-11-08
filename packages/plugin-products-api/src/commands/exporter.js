const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

// const { MONGO_URL } = process.env;
const MONGO_URL = 'mongodb://localhost/bto_test';

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
let db;
let ProductCategories;
let Products;
let Companies;

const command = async () => {
  await client.connect();
  console.log(Boolean(client))
  db = client.db();
  console.log(Boolean(db))

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');
  Companies = db.collection('companies');

  const now = new Date();
  console.log(`Process start at: ${new Date()}`);

  const categories = await ProductCategories.find().toArray();
  const categoryById = {}
  for (const cat of categories) {
    categoryById[cat._id] = cat;
  }

  const companies = await Companies.find().toArray();
  const companyById = {}
  for (const com of companies) {
    companyById[com._id] = com;
  }

  const products = await Products.find({ status: 'active' }).toArray();

  console.log(`start!!_id!!code!!name!!unitPrice!!barcodes!!oldCode!!jin!!temp!!uom!!subUom!!subRatio!!InBox!!imageUrl!!createdAt!!categoryCode!!vendorName!!type!!taxType!!end!!`)

  for (const product of products) {
    console.log(`start!!${(product._id)}!!${(product.code)}!!${(product.name)}!!${(product.unitPrice)}!!${((product.barcodes || []).join(',') || '')}!!${((product.customFieldsData || []).find(cf => cf.field === 'g5BEvd5wBQxi88hTM') || {}).value || ''}!!${((product.customFieldsData || []).find(cf => cf.field === 'vSprymxcavTi5vB98') || {}).value || ''}!!${(product.temp || '')}!!${(product.uom || '')}!!${((product.subUoms || [])[0] || {}).uom || ''}!!${((product.subUoms || [])[0] || {}).ratio || ''}!!${(1 / Number(((product.subUoms || [])[0] || {}).ratio || 1)).toFixed(2) || ''}!!${(product.attachment || {}).url || ''}!!${(product.createdAt || '')}!!${(categoryById[product.categoryId || ''] || {}).code || ''}!!${(companyById[product.vendorId || ''] || {}).primaryName || ''}!!${(product.type || '')}!!${(product.taxType || '')}!!end!!`)
  }

  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
