import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Button, Table, InputNumber, Flex } from 'antd';
import { useParams } from 'react-router-dom';

Modal.setAppElement('#root');

const Add_kW = () => {
  const [ECResults, setECResults] = useState([]);
  const [ReportResults, setReportResults] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [queriedReportResults, setQueriedReportResults] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [totalSums, setTotalSums] = useState({});
  const [kWPerM2Values, setkWPerM2Values] = useState({});
  const { periode } = useParams();
  const [sucsess, setSuccess] = useState(null);

  const columnsECResults = [
    {
      title: 'Asset ID',
      dataIndex: 'Asset_ID',
      key: 'Asset_ID',
    },
    {
      title: 'Region',
      dataIndex: 'Region',
      key: 'Region',
    },
    {
      title: 'Country',
      dataIndex: 'Country',
      key: 'Country',
    },
    {
      title: 'City',
      dataIndex: 'City',
      key: 'City',
    },
    {
      title: 'Address',
      dataIndex: 'Address',
      key: 'Address',
    },
    {
      title: 'Asset_type',
      dataIndex: 'Asset_type',
      key: 'Asset_type',
    },
    {
      title: 'Lease_start',
      dataIndex: 'Lease_start',
      key: 'Lease_start',
    },
    {
      title: 'Lease_end',
      dataIndex: 'Lease_end',
      key: 'Lease_end',
    },
    {
      title: 'Square_meters',
      dataIndex: 'Square_meters',
      key: 'Square_meters',
    },
    {
      title: 'Manual_input',
      dataIndex: 'Manual_input',
      key: 'Manual_input',
    },
    {
      title: 'Electricity Consumption',
      key: 'Electricity_Consumption',
      render: (_, record) => (
        <a>{totalSums[record.Asset_ID]}</a>
      )
    },
    {
      title: 'Electricity Consumption',
      key: 'Electricity_Consumption',
      render: (_, record) => (
        <Button onClick={() => openModal(record.Asset_ID)}>Open Report</Button>
      )
    },
    {
      title: 'kW per m^2',
      key: 'kW_per_m2',
      render: (_, record) => {
        const electricityConsumption = totalSums[record.Asset_ID] || 0;
        const squareMeters = record.Square_meters || 1; // Avoid division by zero
  
        // Calculate kW per m^2
        const kW_per_m2 = electricityConsumption / squareMeters;

        return <span>{kW_per_m2.toFixed(2)}</span>; // Adjust the precision as needed
      }
    }
]

const columnsReportData = [
  {
    title: 'Asset ID',
    dataIndex: 'Asset_ID',
    key: 'Asset_ID'
  },
  {
    title: 'Account_Document_Number',
    dataIndex: 'Account_Document_Number',
    key: 'Account_Document_Number'
  },
  {
    title: 'Periode',
    dataIndex: 'Periode',
    key: 'Periode'
  },
  {
    title: 'Input',
    key: 'input',
    render: (_, record) => (
      <InputNumber  onChange={(value) => handleECValueChange(record, value)}
      value={inputValues[record.Account_Document_Number] || null}/>
    )
  }
]

  useEffect(() => {
    // Make an HTTP request to your Node.js server to run the Python script
    axios
      .post('http://localhost:5000/run-python-script', {periode: periode})
      .then((response) => {
        // Parse the response data (assuming it's in JSON format)
        const electricityConsumptionData = response.data.ElectricityConsumptionData;
        const energyCostRapportData = response.data.EnergyCostRapportData;

        setReportResults(energyCostRapportData);
        setECResults(electricityConsumptionData);
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    const updatedKwPerM2Values = {};
    Object.keys(totalSums).forEach((assetID) => {
      const electricityConsumption = totalSums[assetID] || 0;
  
      // Find the corresponding record in ECResults
      const matchingRecord = ECResults.find((record) => `${record.Asset_ID}` === `${assetID}`);
  
      // Extract Square_meters from the matching record or default to 1
      const squareMeters = matchingRecord?.Square_meters || 1;
  
      // Calculate kW per m^2
      const kW_per_m2 = electricityConsumption / squareMeters;
      updatedKwPerM2Values[assetID] = kW_per_m2.toFixed(2);
    });
  
    setkWPerM2Values(updatedKwPerM2Values);
    console.log(kWPerM2Values); 
  }, [totalSums]);

  const openModal = (assetID) => {
    setQueriedReportResults(ReportResults.filter((item) => item.Asset_ID === assetID));
    setActiveModal(assetID);
    setTotalSum(0)
    setInputValues({})
  };

  const saveInputChanges = () => {
    setTotalSums({ ...totalSums, [activeModal]: totalSum });
    setActiveModal(false); // Close the modal
  };


  const handleECValueChange = (record, value) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[record.Account_Document_Number] = value;
    setInputValues(updatedInputValues);

    // Calculate totalSum based on updatedInputValues
    const sum = Object.values(updatedInputValues).reduce(
      (acc, val) => acc + (parseFloat(val) || 0),
      0
    );
    setTotalSum(sum);
  };

  const commitToDatabase = () => {
    const EData = {
      kW: totalSums,
      kWPerM2Values: kWPerM2Values,
      periode: periode,
    };
    console.log(EData)
    axios
    .post('http://localhost:5000/commit-to-database', EData)
    .then((response) => {
      setSuccess('Successfully Uploaded')
    })
    .catch((error) => {
      // Handle any errors
      console.error('Error:', error);
    });
  };

  return (
    <div id="root">
      <h1>Interface 2 {periode}</h1>
      <Table dataSource={ECResults} columns={columnsECResults}/>
      <Modal
        isOpen={activeModal !== false}
        onRequestClose={saveInputChanges}
        contentLabel="Example Modal"
      >
        <h2>Modal Content {activeModal}</h2>
        <Table dataSource={queriedReportResults} columns={columnsReportData} />

        <strong>Total: {totalSum}</strong>
        <Flex justify='flex-end'>
          <Button type='primary' onClick={saveInputChanges}>Save Changes</Button>
        </Flex>
      </Modal>

      <Flex justify='flex-end'>
        <Button type='primary' onClick={commitToDatabase}>Commit changes to database</Button>
      </Flex>
    </div>
  );
};

export default Add_kW;

