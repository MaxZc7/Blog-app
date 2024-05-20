import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Register from './Register';
import React from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register></Register>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
