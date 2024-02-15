// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes, Link } from 'react-router-dom';
import Upload_file from 'C:\\Users\\carlo\\Desktop\\Energy-Consumtion-Project-main\\frontend\\src\\Pages\\Upload_file.js';
import Add_kW from 'C:\\Users\\carlo\\Desktop\\Energy-Consumtion-Project-main\\frontend\\src\\Pages\\Add_kW.js'; // Import your Interface 2 page component

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Upload_file/ >} />
          <Route path="/add_kw/:periode" element={<Add_kW/ >} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;


