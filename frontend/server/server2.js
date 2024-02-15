const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');

const app = express();
const port = 5000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});
const upload = multer({ storage });

// Handle file uploads
app.post('/upload-file', upload.single('file'), (req, res) => {
  // File is uploaded and saved to the 'uploads' folder
  console.log('File uploaded:', req.file);
  res.send('File uploaded successfully');
});

app.post('/process-data', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;
  if (uploadedFile) {
    // Construct the path to the uploaded file
    const filePath = uploadedFile.path;

    console.log(filePath);

    // Execute the Python script with the uploaded file as input
    const pythonProcess = spawn('python', [
      'C:\\Users\\carlo\\Documents\\ITU\\Enterprise Systems and Information Management\\backend\\test.py',
      JSON.stringify({ file_path: filePath })
    ]);

    pythonProcess.stdout.on('data', (data) => {
      // Handle the output of your Python script here
      console.log(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python Error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python script executed successfully');
        res.send('Data processed successfully');
      } else {
        console.log('Python script execution failed');
        res.status(500).send('Data processing failed');
      }
    });
  } else {
    res.status(400).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
