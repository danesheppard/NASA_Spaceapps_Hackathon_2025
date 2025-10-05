import React from "react";
import { useState } from "react";
import viteLogo2 from "./assets/chatGPT-sad.svg";
import viteLogo from "./assets/ChatGPT-happy.svg";
import video2 from "./assets/video2.mp4";
import "./App.css";
import { NavLink } from "react-router";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="hidden md:flex space-x-8">
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/healthcareaccess">Healthcare Access</NavLink>
          <NavLink to="/airquality">Air Quality</NavLink>
        </nav>
      </div>
      <div>
        <a href="" target="_blank">
          <video
            src={video2}
            width="300"
            height="150"
            controls="controls"
            autoPlay={true}
            loop={true}
          />
        </a>
        <a href="" target="_blank">
          <img src={viteLogo2} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>NASA Space Apps Challenge</h1>
      <h2>The Black Arcs</h2>
    </>
  );
}

export default App;
