const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage with dynamic folder
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = 'default';

    if (req.folderName) {
      folderName = req.folderName; 
    }

    return {
      folder: folderName || 'general',
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
