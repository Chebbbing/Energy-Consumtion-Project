const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});
const upload = multer({ storage });

app.use(cors());

// Handle file uploads
app.post('/upload-file', upload.single('file'), (req, res) => {
  // File is uploaded and saved to the 'uploads' folder
  console.log('File uploaded:', req.file);
  res.send('File uploaded successfully');
});

app.post('/process-data', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;
  const format = req.body.format; // Get the format from the request
  const periode = req.body.periode; // Get the periode from the request

  if (uploadedFile) {
    // Construct the path to the uploaded file
    const filePath = uploadedFile.path;

    // Execute the Python script with the uploaded file, format, and periode
    const pythonProcess = spawn('python', [
      'C:\\Users\\carlo\\Documents\\ITU\\Enterprise Systems and Information Management\\backend\\test.py', // Replace with the actual path to your Python script
      filePath,
      format,
      periode
    ]);

    let pythonOutput = ''; 

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
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



//Getting the database information
app.post('/run-python-script', (req, res) => {
  const periode = req.body.periode

  // Execute the Python script
  const pythonProcess = spawn('python', ['C:\\Users\\carlo\\Documents\\ITU\\Enterprise Systems and Information Management\\backend\\kladd.py', periode]);

  let pythonOutput = ''; // Variable to store Python script output

  pythonProcess.stdout.on('data', (data) => {
    // Handle the output from the Python script
    pythonOutput += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error('Python Error:', data.toString());
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(pythonOutput); // Assuming Python script returns JSON
        res.json(result); // Send the JSON response to the React app
      } catch (error) {
        res.status(500).json({ error: 'Invalid JSON response' });
      }
    } else {
      console.log('Python script execution failed');
      res.status(500).send('Python script execution failed');
    }
  });
});



app.post('/commit-to-database', (req, res) => {
  let { kW, kWPerM2Values, periode } = req.body;

  kW = JSON.stringify(kW, null, 2);
  kWPerM2Values = JSON.stringify(kWPerM2Values, null, 2);
  periode = JSON.stringify(periode, null, 2);

  const pythonProcess = spawn('python', ['C:\\Users\\carlo\\Documents\\ITU\\Enterprise Systems and Information Management\\backend\\commit_to_database.py', kW, kWPerM2Values, periode]);

  let pythonOutput = ''; // Variable to store Python script output

  pythonProcess.stdout.on('data', (data) => {
    // Handle the output from the Python script
    pythonOutput += data.toString();
    console.log(pythonOutput)
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error('Python Error:', data.toString());
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(pythonOutput); // Assuming Python script returns JSON
        res.json(result); // Send the JSON response to the React app
      } catch (error) {
        res.status(500).json({ error: 'Invalid JSON response' });
      }
    } else {
      console.log('Python script execution failed');
      res.status(500).send('Python script execution failed');
    }
  });

});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});