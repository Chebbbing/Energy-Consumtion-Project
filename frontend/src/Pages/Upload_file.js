import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import { Button, Divider, Select, Space, Input } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import logoImage from '../Assets/Logo.png'; //logo image
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';


function MyComponent() {
  const [uploadedFile, setUploadedFile] = useState('')
  const [format, setFormat] = useState('EP1');
  const [periode, setPeriode] = useState('2023 Q1');
  const [periodeInterface2, setPeriodeInterface2] = useState('2023_Q1');


  const { Dragger } = Upload; //This is handling the upload from the drag and drop upload
  const props = {
    name: 'file',
    multiple: false,
    action: 'http://localhost:5000/upload',
    beforeUpload: (file, fileList) => {
      // Prevent upload if a file is already uploaded
      if (uploadedFile) {
        message.error('A file is already uploaded. Please remove the existing file before uploading another.');
        return Upload.LIST_IGNORE; // This will ignore the file upload attempt
      }
      return true; // Allow upload if no file is uploaded yet
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setUploadedFile(info.file.name); // Update state to reflect the uploaded file
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: (file) => {
      // Update state to reflect the file removal
      setUploadedFile(null);
      message.info(`${file.name} file removed.`);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };


  //handles change of the format
  const handleFormatChange = (value) => {
    setFormat(value);
  };

  //handles change of the format
  const handlePeriodeChange = (value) => {
    setPeriode(value);
  };

  //handles the periode Interface 2 is displayed in 
  const periodeForInterface2 = (value) => {
    setPeriodeInterface2(value)
  };

  const handleFileUpload = () => {
    if (uploadedFile) {
      // Use Axios to send the file to the server
      axios.post('http://localhost:5000/process-data', {format: format, periode: periode, file_identifier: uploadedFile})
        .then(response => {
          // Handle the response from the server
          console.log('Response from the server:', response.data);
        })
        .catch(error => {
          // Handle errors
          console.error('Error:', error);
        });
    }
  };


  return (
    <div>
      <h1>Upload Electricity Data</h1>
      <Space>

      <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      </Dragger>

      <Select 
      defaultValue={'EP1'} 
      onChange={handleFormatChange}
      options={[
        {
          value: 'EP1',
          label: 'Energy Provider 1',
        },
        {
          value: 'EP2',
          label: 'Energy Provider 2',
        },
        {
          value: 'StoreReadable',
          label: 'Stores with readable information',
        },
        {
          value: 'RCP',
          label: 'Energy Cost Rapport',
        },
      ]}
      />
      
      <Select
      defaultValue={'2023_Q1'}
      onChange={handlePeriodeChange}
      options={[
        {
          value: '2023_Q1',
          label: '2023 Q1',
        },
        {
          value: '2023_Q2',
          label: '2023 Q2',
        },
        {
          value: '2023_Q3',
          label: '2023 Q3',
        },
        {
          value: '2023_Q4',
          label: '2023 Q4',
        },
        {
          value: '2024_Q1',
          label: '2024 Q1',
        },
        {
          value: '2024_Q2',
          label: '2024 Q2',
        },
        {
          value: '2024_Q3',
          label: '2024 Q3',
        },
        {
          value: '2024_Q4',
          label: '2024 Q4',
        },
      ]}
      />


      <Button onClick={handleFileUpload} type='primary'>Upload to Database</Button>

      </Space>
      
      <Divider/>
      
      <Link to={`/add_kw/${periodeInterface2}`}>
        <Button type='primary'>Add Electricity Data</Button>
      </Link>

      <Select
      defaultValue={'2023_Q1'}
      onChange={periodeForInterface2}
      options={[
        {
          value: '2023_Q1',
          label: '2023 Q1',
        },
        {
          value: '2023_Q2',
          label: '2023 Q2',
        },
        {
          value: '2023_Q3',
          label: '2023 Q3',
        },
        {
          value: '2023_Q4',
          label: '2023 Q4',
        },
        {
          value: '2024_Q1',
          label: '2024 Q1',
        },
        {
          value: '2024_Q2',
          label: '2024 Q2',
        },
        {
          value: '2024_Q3',
          label: '2024 Q3',
        },
        {
          value: '2024_Q4',
          label: '2024 Q4',
        },
      ]}
      />
      
      <div style={{position: 'fixed', bottom:10, right: 10}}>
        <img src={logoImage} style={{ width: 175, height: 'auto' }} />
      </div>

    </div>
  );
}

export default MyComponent;