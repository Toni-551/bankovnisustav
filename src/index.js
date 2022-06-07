import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Outlet } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

import Klijent from './routes/Klijenti';
import Login from './routes/Login';
import Administracija from './routes/Administracija';
import Transakcija from './routes/Transakcija';
import Zaposlenici from './routes/Zaposlenici';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route path="login" element={<Login />} />
        <Route path="administracija/" element={<Administracija/>}>
          <Route path="klijenti" element={<Klijent />} />
          <Route path="transakcije" element={<Transakcija/>} />
          <Route path="Zaposlenici" element={<Zaposlenici/>} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
