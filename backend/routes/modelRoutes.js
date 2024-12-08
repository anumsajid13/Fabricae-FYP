const express = require("express");
const router = express.Router();
const ThreeDMockup  = require('../Data/Models/3dModel');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const multer = require('multer');
const serviceAccount = require('../config/serviceAccountKey.json');


initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'farbricaepatterns.appspot.com', //bucket name
});

const bucket = getStorage().bucket();



const upload = multer({ storage: multer.memoryStorage() });

const uploadToFirebase = async (file, folder) => {
  if (!file) throw new Error('File is required');
  const fileName = `${folder}/${Date.now()}_${file.originalname}`;
  const fileRef = bucket.file(fileName);
  await fileRef.save(file.buffer, {
    contentType: file.mimetype,
  });
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
};

//create mockup 
router.post(
  '/create-3d-mockups',
  upload.fields([{ name: 'glbFile', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
  async (req, res) => {
    try {
      const { garmentType, mockupName, pattern, embellishments, exportOptions } = req.body;
      const glbFile = req.files?.glbFile?.[0];
      const images = req.files?.images;

      if (!garmentType || !mockupName || !glbFile) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      
      const glbUrl = await uploadToFirebase(glbFile, '3d-mockups');

     
      const imageUrls = [];
      if (images && images.length > 0) {
        for (const image of images) {
          const imageUrl = await uploadToFirebase(image, 'mockup-images');
          imageUrls.push(imageUrl);
        }
      }

     
      const newMockup = new ThreeDMockup({
        mockupName,
        pattern,
        garmentType,
        embellishments: embellishments === 'true', 
        exportOptions: exportOptions ? JSON.parse(exportOptions) : undefined,
        glbUrl,
        images: imageUrls,
      });

      const savedMockup = await newMockup.save();

      res.status(201).json(savedMockup);
    } catch (error) {
      console.error('Error creating 3D mockup:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);


router.get('/3d-mockups', async (req, res) => {
  try {
    const mockups = await ThreeDMockup.find();
    res.status(200).json(mockups);
  } catch (error) {
    console.error('Error retrieving 3D mockups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/3d-mockups/:id', async (req, res) => {
  try {
    const mockup = await ThreeDMockup.findById(req.params.id);

    if (!mockup) {
      return res.status(404).json({ error: 'Mockup not found' });
    }

    res.status(200).json(mockup);
  } catch (error) {
    console.error('Error retrieving mockup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update glbUrl for a specific mockup
router.put('/3d-mockups/:id', upload.single('glbFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const glbFile = req.file;

    if (!glbFile) {
      return res.status(400).json({ error: 'GLB file is required for updating' });
    }

    // Upload new GLB file to Firebase
    const newGlbUrl = await uploadToFirebase(glbFile, '3d-mockups');

    // Update the database with the new GLB URL
    const updatedMockup = await ThreeDMockup.findByIdAndUpdate(
      id,
      { glbUrl: newGlbUrl },
      { new: true } // Return the updated document
    );

    if (!updatedMockup) {
      return res.status(404).json({ error: 'Mockup not found' });
    }

    res.status(200).json(updatedMockup);
  } catch (error) {
    console.error('Error updating GLB URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
