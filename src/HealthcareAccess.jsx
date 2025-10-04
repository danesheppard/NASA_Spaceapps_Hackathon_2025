// Export a blank react component
import React from "react";
<<<<<<< Updated upstream
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { NavLink } from "react-router";
import { DeckGL } from "@deck.gl/react";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, GeoJsonLayer, PolygonLayer } from "@deck.gl/layers";
import { RasterTileLayer, rasterSource } from "@deck.gl/carto";
import { ZoomWidget } from "@deck.gl/react";
import { scaleThreshold } from "d3-scale";

const INITIAL_VIEW_STATE = {
  longitude: -84.217296,
  latitude: 33.932465,
  zoom: 13,
};

// Scale colour from green (low pollution) to red (high pollution)
const COLOR_SCALE = scaleThreshold()
  .domain([0, 0.2, 0.4, 0.6, 0.8, 1.0])
  .range([
    [0, 255, 0],
    [127, 255, 0],
    [255, 255, 0],
    [255, 127, 0],
    [255, 0, 0],
  ]);

const POLLUTION_DATA_URL =
  "../pollutionExposure/processedData/ec_2019_georgia.geojson";

// const rasterData = new rasterSource({
//   accessToken: "local",
//   url: "/layerData/GHS_BUILT_S_E2025_GLOBE_R2023A_54009_100_V1_0_R5_C11.tif",
// });

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
  // new PolygonLayer({
  //   id: "Pollution grid",
  //   data: POLLUTION_DATA_URL,
  //   filled: true,
  //   getPolygon: (d) => d.geometry.coordinates,
  // }),
  new GeoJsonLayer({
    id: "Pollution data",
    data: POLLUTION_DATA_URL,
    filled: true,
    getFillColor: (d) => {
      const ecValue = d.properties.ec_normalized;
      return COLOR_SCALE(ecValue);
    },
    getElevation: (f) => {
      // We want the elevation to scale fairly dramatically to make the differences more visible
      const ecValue = f.properties.ec * 100;
      return Math.max(0, ecValue * ecValue); // Scale factor of 500
    },
    extruded: true,
    pickable: true,
  }),
];
=======
>>>>>>> Stashed changes

function HealthcareAccess() {
  return (
    <div>
      <h1>Healthcare Access</h1>
    </div>
  );
}

export default HealthcareAccess;
