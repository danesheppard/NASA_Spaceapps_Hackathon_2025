import React from "react";
import happyEarth from "./assets/happyEarth-watermarked.mp4";
import sadEarth from "./assets/sadEarth-watermarked.mp4";
import { NavLink } from "react-router";
import "./App.css";

function App() {
  return (
    <>
      <div className="videoContainer">
        <video
          src={happyEarth}
          style={{ position: "relative", top: "5%", left: "5%" }}
          width="600"
          height="300"
          controls={false}
          autoPlay={true}
          loop={true}
        />
        <video
          src={sadEarth}
          style={{ position: "relative", top: "5%", right: "5%" }}
          width="600"
          height="300"
          controls={false}
          autoPlay={true}
          loop={true}
        />
      </div>
      <h1>Welcome to CitiSense</h1>
      <h2>
        Submitted by Team Black Arcs as part of the 2025 NASA Space Apps
        Challenge
      </h2>
      <h3>
        CitiSense is a hackathon proof-of-concept for a data visualization/data
        fusion tool intended to help urban planners, local governments, and
        interested citizens to leverage all the wonderful data provided for free
        by NASA to make data-driven decisions about building healthier human
        settlements. A fully realized CitiSense would allow users to fuse data
        layers, run on-the-fly analysis, and understand how different
        environmental factors interact with each other to affect human health
        and well-being.
      </h3>
      <div className="goToMap">
        <nav>
          <NavLink to="/deckcomponent">
            Click here to view the proof-of-concept!
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default App;
