import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ForecastChart from './components/chart_page/ForecastChart';

ReactDOM.render(

  <Router>
    <Routes>
      <Route path="/" element={ <App /> } />
      <Route path="/:cityId" element={ <ForecastChart /> } />
    </Routes>
  </Router>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
