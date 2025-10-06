import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { DeckGL } from "@deck.gl/react";
import { TileLayer } from "@deck.gl/geo-layers";
import {
  BitmapLayer,
  GeoJsonLayer,
  IconLayer,
  ScatterplotLayer,
} from "@deck.gl/layers";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { CSVLoader } from "@loaders.gl/csv";
import { load } from "@loaders.gl/core";

import { RasterTileLayer, rasterSource } from "@deck.gl/carto";
import { scaleThreshold } from "d3-scale";

const INITIAL_VIEW_STATE = {
  longitude: -84.237296,
  latitude: 33.932465,
  pitch: 45,
  bearing: -45,
  zoom: 12,
};

// Scale colour from green (low pollution) to red (high pollution)
const COLOR_SCALE = scaleThreshold()
  .domain([0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
  .range([
    [0, 255, 0], // green
    [85, 255, 0], // yellow-green
    [170, 255, 0], // light green
    [210, 255, 60], // yellowish-green
    [255, 255, 0], // yellow
    [255, 220, 0], // yellow-orange
    [255, 180, 0], // orange-yellow
    [255, 140, 0], // orange
    [255, 100, 0], // orange-red
    [255, 60, 0], // red-orange
    [255, 0, 0], // red
    [255, 0, 0], // red (keep red for upper end)
    [255, 0, 0], // red (keep red for upper end)
  ]);

// For population density, go from light blue (low) to purple (high)
const COLOR_SCALE_POPULATION = scaleThreshold()
  .domain([
    0, 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1,
  ])
  .range([
    [230, 245, 255], // very light blue
    [200, 230, 255],
    [173, 216, 230],
    [150, 210, 240],
    [135, 206, 250],
    [100, 200, 255],
    [0, 191, 255],
    [0, 170, 255],
    [0, 150, 255],
    [0, 0, 255],
    [75, 0, 130],
    [120, 0, 180],
    [148, 0, 211],
  ]);

const ABI_COLOR_SCALE = scaleThreshold()
  .domain([
    0, 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1,
  ])
  .range([
    [255, 255, 255], // white
    [255, 220, 220], // light red
    [255, 180, 180], // red
    [255, 140, 140], // dark red
    [255, 100, 100], // darker red
    [255, 60, 60], // even darker red
    [255, 0, 0], // bright red
    [220, 0, 0], // dark bright red
    [180, 0, 0], // darker bright red
    [140, 0, 0], // even darker bright red
    [100, 0, 0], // dark red
    [60, 0, 0], // darker red
    [0, 0, 0], // black
  ]);

const ABI_DATA_URL = "/demoData/air_burden_index.csv";
const POLLUTION_DATA_URL = "/demoData/ec_2019_ptc_trimmed.csv";
const HOSPITAL_DATA_URL = "/demoData/hospital.geojson";
const POPULATION_DATA_URL = "/demoData/populationData_PeachtreeCorners.csv";

function DeckComponent() {
  // State management to handle DeckGL data uploads and button toggles
  const [pollutionData, setPollutionData] = useState([]);
  const [populationData, setPopulationData] = useState([]);
  const [abiData, setAbiData] = useState([]);
  const [buttonStates, setbuttonStates] = useState({
    pollution: false,
    population: false,
    hospitals: false,
    abi: false,
  });

  const toggleButton = (button) => {
    const newButtonState = !buttonStates[button];
    const buttonCallback = (prev) => {
      if (button == "abi" && newButtonState) {
        return {
          ...prev,
          pollution: false,
          population: buttonStates.population,
          hospitals: false,
          [button]: newButtonState,
        };
      } else {
        return { ...prev, [button]: newButtonState };
      }
    };
    setbuttonStates(buttonCallback);
    let foundLayer;
    switch (button) {
      case "pollution":
        foundLayer = layers.find((layer) => layer.id === "Pollution hexagons");
        if (foundLayer) {
          foundLayer.visible = newButtonState;
        }
        break;
      case "population":
        foundLayer = layers.find((layer) => layer.id === "Population hexagons");
        if (foundLayer) {
          foundLayer.visible = newButtonState;
        }
        break;
      case "hospitals":
        foundLayer = layers.find((layer) => layer.id === "Hospitals");
        if (foundLayer) {
          foundLayer.visible = newButtonState;
        }
        break;
      case "abi":
        foundLayer = layers.find((layer) => layer.id === "Air Burden Index");
        if (foundLayer) {
          foundLayer.visible = newButtonState;
        }
    }
  };

  // Load data from CSV and GeoJSON files on component mount
  useEffect(() => {
    const getData = async () => {
      const loadedPollutionData = await load(POLLUTION_DATA_URL, CSVLoader);
      const loadedPopulationData = await load(POPULATION_DATA_URL, CSVLoader);
      const loadedABIData = await load(ABI_DATA_URL, CSVLoader);
      setPollutionData(loadedPollutionData.data);
      setPopulationData(loadedPopulationData.data);
      setAbiData(loadedABIData.data);
    };
    getData();
  }, []);

  // Build DeckGL layers
  // Their visibility is linked to buttonStates for smooth React state management
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
    new HexagonLayer({
      id: "Pollution hexagons",
      gpuAggregation: true,
      colorRange: COLOR_SCALE.range(),
      data: pollutionData,
      getPosition: (d) => [d.longitude, d.latitude],
      getColorWeight: (d) => d.ec,
      getElevationWeight: (d) => {
        // Use exponential scaling to accentuate differences
        return d.ec * d.ec * d.ec;
      },
      extruded: true,
      coverage: 1,
      elevationRange: [0, 2000],
      elevationScale: buttonStates.pollution ? 5 : 0,
      visible: buttonStates.pollution,
      radius: 100,
      upperPercentile: 100,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51],
      },
      transitions: {
        elevationScale: 3000,
      },
    }),
    new HexagonLayer({
      id: "Air Burden Index",
      gpuAggregation: true,
      colorRange: ABI_COLOR_SCALE.range(),
      data: abiData,
      getPosition: (d) => [d.longitude, d.latitude],
      getColorWeight: (d) => d.abi_rescaled,
      getElevationWeight: (d) => {
        // Use exponential scaling to accentuate differences
        return d.abi_rescaled * d.abi_rescaled * d.abi_rescaled;
      },
      extruded: true,
      coverage: 1,
      elevationRange: [0, 2000],
      elevationScale: buttonStates.abi ? 5 : 0,
      visible: buttonStates.abi,
      radius: 100,
      upperPercentile: 100,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51],
      },
      transitions: {
        elevationScale: 3000,
      },
    }),
    new GeoJsonLayer({
      id: "Hospital data",
      data: HOSPITAL_DATA_URL,
      filled: true,
      pointRadiusMinPixels: 5,
      getFillColor: [255, 0, 0],
      getPointRadius: 100,
      visible: buttonStates.hospitals,
      getLineWidth: 2,
    }),
    new ScatterplotLayer({
      id: "Population Density",
      data: populationData,
      radiusScale: 50,
      radiusMinPixels: 0.25,
      getPosition: (d) => [d.longitude, d.latitude, 0],
      getFillColor: (d) => COLOR_SCALE_POPULATION(d.population_normalized),
      getRadius: 0.9,
      visible: buttonStates.population,
    }),
  ];

  return (
    <>
      <button className="calculate-btn" onClick={() => toggleButton("abi")}>
        Calculate ABI
      </button>
      <div className="sidebar">
        <button
          className="sidebar-btn"
          onClick={() => toggleButton("pollution")}
        >
          Show Pollution
        </button>
        <button
          className="sidebar-btn"
          onClick={() => toggleButton("population")}
        >
          Show Population
        </button>
        <button
          className="sidebar-btn"
          onClick={() => toggleButton("hospitals")}
        >
          Show Hospitals
        </button>
      </div>
      <button className="back-btn" onClick={() => (window.location.href = "/")}>
        Back to Home
      </button>
      <div>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller
          layers={layers}
        ></DeckGL>
      </div>
    </>
  );
}

export default DeckComponent;
