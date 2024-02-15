const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Configure multer with file filter for Excel files
const excelFilter = (req, file, cb) => {
  // Accept Excel files only
  if (!file.originalname.match(/\.(xlsx|xls|xlsm)$/)) {
    req.fileValidationError = 'Only Excel files are allowed!';
    return cb(new Error('Only Excel files are allowed!'), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Use the file's original name or you can set a new one
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage, fileFilter: excelFilter });

app.post('/upload', upload.array('file', 5), (req, res) => { // change to .array for multiple files
  // Check if file validation error is present
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  }
  
  // Check if file is present after filtering
  if (!req.files) {
    return res.send('Please upload an Excel file.');
  }

  // File is saved to the uploads directory
  res.send('Files uploaded successfully!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

