import React from 'react';

function randomPosition(max) {
  return Math.floor(Math.random() * max);
}

export default function GalaxyCluster({ onGalaxyClick }) {
  const galaxies = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, #0a0a2a 0%, #000000 90%)',
        overflow: 'hidden',
        zIndex: 1,
        cursor: 'pointer',
      }}
    >
      {galaxies.map((id) => {
        const size = 30 + Math.random() * 40; // Taille variable pour dynamiser le visuel
        const x = randomPosition(window.innerWidth - size);
        const y = randomPosition(window.innerHeight - size);
        const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;

        return (
          <div
            key={id}
            onClick={() => onGalaxyClick(id)}
            title={`Galaxie #${id}`}
            style={{
              position: 'absolute',
              top: y,
              left: x,
              width: size,
              height: size,
              background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 15px 3px ${color}`,
              animation: `pulse-${id % 5} 3s ease-in-out infinite`,
            }}
          />
        );
      })}

      <style>{`
        @keyframes pulse-0 {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        @keyframes pulse-1 {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes pulse-2 {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes pulse-3 {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.25); opacity: 0.5; }
        }
        @keyframes pulse-4 {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
