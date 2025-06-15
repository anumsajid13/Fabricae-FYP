const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getStorage } = require('firebase-admin/storage');

const router = express.Router();

// Initialize Firebase Admin SDK (make sure this is done in your main app file)
// const serviceAccount = require('./path/to/your/serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'your-project-id.appspot.com'
// });

// Get Firebase Storage bucket
const bucket = getStorage().bucket();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'), false);
    }
  }
});

// Helper function to get file extension
const getFileExtension = (mimetype) => {
  const extensions = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
  };
  return extensions[mimetype] || '';
};

// Helper function to sanitize filename
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Check if email is provided
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const file = req.file;
    const originalName = file.originalname;
    const fileExtension = getFileExtension(file.mimetype);

    // Create a unique filename
    const timestamp = Date.now();
    const uniqueId = uuidv4().substring(0, 8);
    const sanitizedName = sanitizeFilename(path.parse(originalName).name);
    const fileName = `${sanitizedName}_${timestamp}_${uniqueId}${fileExtension}`;

    // Create file path with user email
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9@.-]/g, '_');
    const filePath = `portfolios/${sanitizedEmail}/${fileName}`;

    // Create a file reference in Firebase Storage
    const fileRef = bucket.file(filePath);

    // Upload file to Firebase Storage
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: originalName,
          uploadedBy: email,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Handle upload errors
    stream.on('error', (error) => {
      console.error('Error uploading file to Firebase:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload file to storage'
      });
    });

    // Handle successful upload
    stream.on('finish', async () => {
      try {
        // Make the file publicly readable
        await fileRef.makePublic();

        // Get the public download URL
        const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

        // Alternative: Get signed URL (more secure, expires after specified time)
        // const [signedUrl] = await fileRef.getSignedUrl({
        //   action: 'read',
        //   expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
        // });

        res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          downloadUrl: downloadUrl,
          fileName: fileName,
          originalName: originalName,
          fileSize: file.size,
          mimeType: file.mimetype,
          filePath: filePath
        });

      } catch (error) {
        console.error('Error generating download URL:', error);
        res.status(500).json({
          success: false,
          error: 'File uploaded but failed to generate download URL'
        });
      }
    });

    // Write the file buffer to the stream
    stream.end(file.buffer);

  } catch (error) {
    console.error('Upload route error:', error);

    // Handle specific multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 10MB'
        });
      }
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during file upload'
    });
  }
});

// Optional: Route to delete file
router.delete('/delete/:filePath(*)', async (req, res) => {
  try {
    const filePath = req.params.filePath;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Verify the file belongs to the user
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9@.-]/g, '_');
    if (!filePath.startsWith(`portfolios/${sanitizedEmail}/`)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to delete this file'
      });
    }

    const fileRef = bucket.file(filePath);

    // Check if file exists
    const [exists] = await fileRef.exists();
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Delete the file
    await fileRef.delete();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    });
  }
});

module.exports = router;