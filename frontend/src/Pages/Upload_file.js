import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import { Button, Upload, Divider, Select, Space, Input } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';


function MyComponent() {
  const [selectedFile, setSelectedFile] = useState('');
  const [format, setFormat] = useState('EP1');
  const [periode, setPeriode] = useState('2023 Q1');
  const [periodeInterface2, setPeriodeInterface2] = useState('2023_Q1');

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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    console.log(format)
    console.log(periode)
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('format', format);
      formData.append('periode', periode);

      // Use Axios to send the file to the server
      axios.post('http://localhost:5000/process-data', formData)
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
      <h1>Interface 1</h1>
      <Space>
      <input onChange={handleFileChange} type='file' />

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
      
      


    </div>
  );
}

export default MyComponent;