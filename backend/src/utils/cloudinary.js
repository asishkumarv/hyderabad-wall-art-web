const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a base64 string or file URL to Cloudinary and returns the secure URL.
 * @param {string} fileStr base64 string or file URL
 * @param {string} folder folder name in Cloudinary
 * @returns {Promise<string>} secure URL
 */
const uploadToCloudinary = async (fileStr, folder = 'hyderabad_wall_arts') => {
  if (!fileStr) return null;
  if (!fileStr.startsWith('data:')) {
    // If it's already a URL, return it as is
    return fileStr;
  }
  
  try {
    const result = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: 'auto' // auto handles both image and video
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Recursively scans an object/array, finds any base64 string (starting with 'data:'),
 * uploads it to Cloudinary, and replaces it with the Cloudinary URL.
 */
async function processMediaFields(obj, folder = 'hyderabad_wall_arts') {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    if (obj.startsWith('data:')) {
      return await uploadToCloudinary(obj, folder);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (const item of obj) {
      newArr.push(await processMediaFields(item, folder));
    }
    return newArr;
  }

  if (typeof obj === 'object') {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await processMediaFields(obj[key], folder);
    }
    return newObj;
  }

  return obj;
}

module.exports = {
  uploadToCloudinary,
  processMediaFields
};
