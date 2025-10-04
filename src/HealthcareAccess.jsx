import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { NavLink } from "react-router";


function HealthcareAccess() {
  const [count, setCount] = useState(0)

  return (
      <>
      <nav>
      <NavLink to="/healthcareaccess" end>
        Healthcare Access
      </NavLink>
    </nav>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Test</h1>
    </>
  )
}

export default HealthcareAccess
