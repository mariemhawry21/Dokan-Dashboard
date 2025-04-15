const cloudinary = require('cloudinary').v2;
const Image = require('../models/gallary.model');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const updateImagesInDatabase = async () => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
    });

    const images = result.resources.map((img) => ({
      public_id: img.public_id,
      url: img.secure_url,
    }));

    for (const image of images) {
      try {
        await Image.updateOne(
          { public_id: image.public_id },
          { $set: image },
          { upsert: true }
        );
      } catch (err) {
        console.error(
          `Error in updating or inserting image ${image.public_id}:`,
          err
        );
      }
    }
    // console.log("Images updated successfully");
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Route to save image manually
const updatedImages = async (req, res) => {
  try {
    const images = await updateImagesInDatabase();
    res.status(201).json({ message: 'Images updated', images });
  } catch (error) {
    console.error('Error updating images:', error);
    res.status(500).json({ error: 'Failed to update images' });
  }
};

// Route to get images from db
// const getImages = async (req, res) => {
//   try {
//     const images = await Image.find({}, { __v: false });
//     res.json(images);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Failed to display images" });
//   }
// };

const getImages = async (req, res) => {
  try {
    const { product, color } = req.query;

    if (!product || !color) {
      return res.status(400).json({ error: 'Product and color are required' });
    }

    const allImages = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
    });

    const filterImages = allImages.resources.filter((img) => {
      const splitPAth = img.public_id.split('/');
      return (
        splitPAth.length >= 4 &&
        splitPAth[splitPAth.length - 3].toLowerCase() ===
          product.toLowerCase() &&
        splitPAth[splitPAth.length - 2].toLowerCase() === color.toLowerCase()
      );
    });

    const images = filterImages.map((img) => ({
      public_id: img.public_id,
      url: img.secure_url,
    }));

    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

setInterval(async () => {
  try {
    await updateImagesInDatabase();
  } catch (error) {
    console.error('Error:', error);
  }
}, 60000);

module.exports = { updatedImages, getImages };
