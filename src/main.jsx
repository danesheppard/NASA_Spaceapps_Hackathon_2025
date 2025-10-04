import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';

import './index.css'
import App from './App.jsx'
import HealthcareAccess from './HealthcareAccess'
import AirQuality from './AirQuality'

const root = document.getElementById("root");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="healthcareaccess" element={<HealthcareAccess/>}/>
        <Route path="airquality" element={<AirQuality/>}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
