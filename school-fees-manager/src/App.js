import React from 'react';
import { BrowserRouter as BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginSignup from './Components/LoginSignUp/LoginSignup';
import Home from './Components/Home/Home';



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/Home' element={<Home />} />
      <Route path='/LoginSignup' element={<LoginSignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
