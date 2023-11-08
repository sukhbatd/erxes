
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

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

  const catCodes = { '01': '10000', '02': '10500', '03': '11000', '04': '11500', '05': '12000', '06': '12500', '07': '13000', '08': '13500', '09': '14000', '10': '14500', '11': '15000', '12': '15500', '13': '16000', '14': '16500', '15': '17000', '16': '17500', '17': '18000', '18': '18500', '19': '19000', '20': '19500', '21': '20000', '22': '20500', '23': '21000', '24': '21500', '25': '22000', '26': '22500', '27': '23000', '28': '23500', '29': '24000', '30': '24500', '31': '25000', '32': '25500', '33': '26000', '34': '26500', '35': '27000', '36': '27500', '37': '28000', '38': '28500', '39': '29000', '40': '29500', '41': '30000', '42': '30500', '43': '31000', '44': '31500', '45': '32000', '46': '32500', '47': '33000', '48': '33500', '49': '34000', '50': '34500', '51': '35000', '52': '35500', '53': '36000', '54': '36500', '55': '37000', '56': '37500', '57': '38000', '58': '38500', '59': '39000', '60': '39500', '61': '40000', '62': '40500', '63': '41000', '64': '41500', '65': '42000', '66': '42500', '67': '43000', '68': '43500', '69': '44000', '70': '44500', '71': '45000', '72': '45500', '73': '46000', '74': '46500', '75': '47000', '76': '47500', '77': '48000', '78': '48500', '79': '49000', '80': '49500', '81': '50000', '82': '50500', '83': '51000', '84': '51500', '85': '52000', '86': '52500', '87': '53000' };

  for (const catCode of Object.keys(catCodes)) {
    const category = await ProductCategories.findOne({ code: catCode });
    if (!category) {
      console.log('category not found', catCode)
    }
    begin2 = (catCodes[catCode]).substring(0, 2);
    third = Number((catCodes[catCode]).substring(2, 3));
    const variants = [`${begin2}${third}`, `${begin2}${third + 1}`, `${begin2}${third + 2}`, `${begin2}${third + 3}`, `${begin2}${third + 4}`]

    const products = await Products.find({ categoryId: category._id, status: {$ne: 'deleted'} }).toArray();

    prodLoop: for (const prod of products) {
      if (variants.includes(`${prod.code.substring(0, 3)}`)) {
        continue;
      }

      const customFieldsData = prod.customFieldsData || [];
      const lockCode = prod.code;
      let changeCode = prod.code;

      // ehleed 5 variantaar buh baraand shalgah
      for (const variant of variants) {
        const newCode = `${variant}${lockCode.substring(3)}`;
        const dupProduct = await Products.findOne({ code: newCode });
        if (dupProduct) {
          continue;
        }

        if (!(customFieldsData || []).filter(f => f.field === 'g5BEvd5wBQxi88hTM').length) {
          customFieldsData.push({
            "field": "g5BEvd5wBQxi88hTM",
            "value": `${lockCode}`,
            "stringValue": `${lockCode}`,
            "numberValue": null
          })
        }
        await Products.updateOne({ _id: prod._id }, { $set: { code: newCode, customFieldsData, temp: 'categoryRule' } });

        changeCode = newCode;
        console.log('updated', lockCode, ' to ', newCode);
        continue prodLoop;
      }

      // 5 variant 5uulaa davhardsan bol deleted baraag soliboj tohiruulah
      if (changeCode === lockCode) {
        for (const variant of variants) {
          const newCode = `${variant}${lockCode.substring(3)}`;
          const dupDelProduct = await Products.findOne({ code: newCode, status: 'deleted' });

          if (dupDelProduct) {
            await Products.updateOne({ _id: dupDelProduct._id }, { $set: { code: `${dupDelProduct.code}<>`, temp: 'deletedToCategoryRule' } });

            if (!(customFieldsData || []).filter(f => f.field === 'g5BEvd5wBQxi88hTM').length) {
              customFieldsData.push({
                "field": "g5BEvd5wBQxi88hTM",
                "value": `${lockCode}`,
                "stringValue": `${lockCode}`,
                "numberValue": null
              })
            }
            await Products.updateOne({ _id: prod._id }, { $set: { code: newCode, customFieldsData, temp: 'categoryRule2' } });

            changeCode = newCode;
            console.log('updatedrr', lockCode, ' to ', newCode);
            continue prodLoop;
          }
        }
      }

      if (changeCode === lockCode) {
        console.log(`error::: prodCode: ${lockCode} newCodes: ${variants.map(v => `${v}${lockCode.substring(3)}`)} duplicated`)
      }
    }
  }

  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
