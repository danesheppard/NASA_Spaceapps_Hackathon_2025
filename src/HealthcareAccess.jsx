import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { NavLink } from "react-router";
import {DeckGL} from '@deck.gl/react';
import {MapViewState} from '@deck.gl/core';
import {LineLayer} from '@deck.gl/layers';

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
        const INITIAL_VIEW_STATE: MapViewState = {
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 13
        };

        type DataType = {
        from: [longitude: number, latitude: number];
        to: [longitude: number, latitude: number];
        };

        function App() {
        const layers = [
            new LineLayer<DataType>({
            id: 'line-layer',
            data: '/path/to/data.json',
            getSourcePosition: (d: DataType) => d.from,
            getTargetPosition: (d: DataType) => d.to,
            })
        ];

        return <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller
            layers={layers} />;
        }
      </div>
      <h1>Test</h1>
    </>
  )
}

export default HealthcareAccess
