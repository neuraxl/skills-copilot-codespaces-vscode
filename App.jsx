import React, { useState } from 'react';
import GalaxyCluster from './components/GalaxyCluster';
import GalaxyVisualization from './components/GalaxyVisualization';

export default function App() {
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);

  function handleGalaxyClick(id) {
    alert(`Bienvenue dans la galaxie #${id} ! Prépare-toi à explorer ses mystères...`);
    setSelectedGalaxy(id);
  }

  return (
    <>
      <GalaxyCluster onGalaxyClick={handleGalaxyClick} />
      <GalaxyVisualization key={selectedGalaxy} /> {/* recharge la galaxie des planètes */}
      <div style={{ position: 'relative', zIndex: 10, padding: '1rem', color: '#eee' }}>
        <h1>NeuraX-Ultime</h1>
        {selectedGalaxy && <p>Exploration en cours de la galaxie #{selectedGalaxy}</p>}
      </div>
    </>
  );
}
