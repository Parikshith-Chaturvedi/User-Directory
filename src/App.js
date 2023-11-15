import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDirectory from './UserDirectory';
import UserProfile from './UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<UserDirectory/>} />
        <Route path="/user/" element={<UserProfile/>} />
      </Routes>
    </Router>
  );
}

export default App;
