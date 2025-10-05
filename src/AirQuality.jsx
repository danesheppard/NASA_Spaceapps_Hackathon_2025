import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { NavLink } from "react-router";
import { DeckGL } from "@deck.gl/react";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { HexagonLayer, GridLayer } from "@deck.gl/aggregation-layers";
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
  .domain([0, 0.2, 0.4, 0.6, 0.8, 1.0])
  .range([
    [0, 255, 0],
    [127, 255, 0],
    [255, 255, 0],
    [255, 127, 0],
    [255, 0, 0],
  ]);

// const POLLUTION_DATA_URL =
//   "../pollutionExposure/processedData/ec_2019_georgia.geojson";
const POLLUTION_DATA_URL =
  "../pollutionExposure/processedData/ec_2019_georgia.csv";
const HOSPITAL_DATA_URL =
  "../pollutionExposure/processedData/hospitals.geojson";

// const rasterData = new rasterSource({
//   accessToken: "local",
//   url: "/layerData/GHS_BUILT_S_E2025_GLOBE_R2023A_54009_100_V1_0_R5_C11.tif",
// });

function AirQuality() {
  const [pollutionData, setPollutionData] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);
  const [elevationScale, setElevationScale] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const loadedPollutionData = await load(POLLUTION_DATA_URL, CSVLoader);
      const loadedHospitalData = await load(HOSPITAL_DATA_URL, CSVLoader);
      // const loadedData = await load(POLLUTION_DATA_URL, CSVLoader);
      // Multiply the ec_normalized value by 100 to get a more useful range for elevation
      // loadedData.data.forEach((d) => {
      //   d.ec = d.ec;
      // });
      setPollutionData(loadedPollutionData.data);
      setHospitalData(loadedHospitalData);
    };
    getData();
  }, []);

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
    // new GeoJsonLayer({
    //   id: "Pollution data",
    //   data: POLLUTION_DATA_URL,
    //   filled: true,
    //   getFillColor: (d) => {
    //     const ecValue = d.properties.ec_normalized;
    //     return COLOR_SCALE(ecValue);
    //   },
    //   getElevation: (f) => {
    //     // We want the elevation to scale fairly dramatically to make the differences more visible
    //     const ecValue = f.properties.ec * 100;
    //     return Math.max(0, ecValue * ecValue); // Scale factor of 500
    //   },
    //   extruded: true,
    //   pickable: true,
    // }),
    new HexagonLayer({
      id: "Pollution hexagons",
      gpuAggregation: true,
      colorRange: COLOR_SCALE.range(),
      data: pollutionData,
      getPosition: (d) => [d.lon, d.lat],
      getColorWeight: (d) => d.ec,
      getElevationWeight: (d) => {
        // Use exponential scaling to accentuate differences
        return d.ec * d.ec * d.ec;
      },
      extruded: true,
      coverage: 1,
      elevationRange: [0, 2000],
      elevationScale: pollutionData && pollutionData.length ? 5 : 0,
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
      id: "Hospital Data",
      data: hospitalData,
      filled: true,
      getFillColor: (d) => {
        return [255, 255, 255, 100];
      },
      getElevation: (f) => {
        return 1000;
      },
      extruded: false,
      pickable: true,
    }),
  ];

  return (
    <>
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

export default AirQuality;
