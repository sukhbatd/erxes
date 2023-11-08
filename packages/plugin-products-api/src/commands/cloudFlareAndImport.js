const dotenv = require('dotenv');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const { images } = require('./dataChecked')

dotenv.config();

const imagesPath = '/home/munkhgoy/Downloads/images/';

const uploadToCFImages = async (file) => {
  const CLOUDFLARE_ACCOUNT_ID = '7c8392aff8ac4518aa06dfa4b6337ef2';
  const CLOUDFLARE_API_TOKEN = '7qkOs6vzTjqz428rLSEr-zh2K2opXDJLAqRjzN3n';
  const CLOUDFLARE_BUCKET_NAME = 'butenorgil';

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;
  const headers = {
    Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
  };

  const fileName = `${file.name.replace(/ /g, '_').replace(/\\./g, '_')}`;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(file.path));
  formData.append('id', `${CLOUDFLARE_BUCKET_NAME}/${fileName}`);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(`Error uploading file to Cloudflare Images ${file.name}`);
  }

  if (data.result.variants.length === 0) {
    throw new Error(`Error uploading file to Cloudflare Images ${file.name}`);
  }

  return data.result.variants[0];
};

const command = async () => {
  const uploadedImages = [];
  const notFoundImages = [];
  for (const imageName of images) {
    const nameOrLink = await uploadToCFImages({ name: imageName, path: `${imagesPath}/${imageName}` });
    console.log(`success: ${nameOrLink}`)
    uploadedImages.push(nameOrLink)
  }

  console.log('notFoundImages:', notFoundImages)

  console.log(`Process finished at: ${new Date()}, count: ${uploadedImages.length}`);

  process.exit();
};

command();
