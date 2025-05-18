import React from 'react';
import GalaxyVisualization from './components/GalaxyVisualization';

export default function App() {
  return (
    <>
      <GalaxyVisualization />
      <div style={{ position: 'relative', zIndex: 10, padding: '1rem', color: '#eee' }}>
        <h1>NeuraX-Ultime</h1>
        {/* Ton interface principale ici */}
      </div>
    </>
  );
}
