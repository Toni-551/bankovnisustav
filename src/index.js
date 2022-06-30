import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

import Klijenti from './routes/Klijenti';
import Login from './routes/Login';
import Administracija from './routes/Administracija';
import Racuni from './routes/Racuni';
import Zaposlenici from './routes/Zaposlenici';
import Klijent from './routes/Klijent';
import NoviKlijent from './routes/NovaOsoba';
import Zaposlenik from './routes/Zaposlenik';
import OnlineBankarstvo from './routes/OnlineBankarstvo';
import Pocetna from './routes/Pocetana';
import OnlineRacun from './routes/OnlineRacun';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route path="login" element={<Login />} />
        <Route path="" element={<Navigate to="/login" />} />
        <Route path="OnlineBankarstvo/" element={<OnlineBankarstvo/>}>
          <Route path="racun/:IdRacun" element={<OnlineRacun/>} />
          <Route path="" element={<Pocetna/>} />
        </Route>
        <Route path="administracija/" element={<Administracija/>}>
          <Route path="klijenti" element={<Klijenti />} />
          <Route path="novaOsoba/:IdOsoba" element={<NoviKlijent />} />
          <Route path="klijent/:KlijentID" element={<Klijent />} />
          <Route path="zaposlenik/:ZaposlenikID" element={<Zaposlenik />} />
          <Route path="racuni" element={<Racuni/>} />
          <Route path="zaposlenici" element={<Zaposlenici/>} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
