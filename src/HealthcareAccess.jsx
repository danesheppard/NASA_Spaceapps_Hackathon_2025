import React from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { NavLink } from "react-router";
import { DeckGL } from "@deck.gl/react";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { ZoomWidget } from "@deck.gl/react";

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
};

const layers = [
  new TileLayer({
    id: "basemap",
    data: ["https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props) => {
      const [[west, south], [east, north]] = props.tile.boundingBox;
      return new BitmapLayer({
        id: `${props.id}-bitmap`,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  }),
];

function HealthcareAccess() {
  const [count, setCount] = useState(0);

  return (
    <>
      <nav>
        <NavLink to="/healthcareaccess" end>
          Healthcare Access
        </NavLink>
      </nav>
      <div>
        return (
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller
          layers={layers}
        >
          <layers
            data="/path/to/data.json"
            getSourcePosition={(d) => d.from}
            getTargetPosition={(d) => d.to}
          />

          <ZoomWidget />
        </DeckGL>
        );
      </div>
      <h1>Test</h1>
    </>
  );
}

export default HealthcareAccess;
