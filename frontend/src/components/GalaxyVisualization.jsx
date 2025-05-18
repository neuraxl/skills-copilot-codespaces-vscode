import React, { useEffect, useRef } from 'react';

const PLANET_COUNT = 12;

function randomColor() {
  const colors = ['#f39c12', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#e67e22', '#1abc9c', '#8e44ad', '#34495e', '#f1c40f', '#c0392b', '#27ae60'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function GalaxyVisualization() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    for (let i = 0; i < PLANET_COUNT; i++) {
      const orbit = document.createElement('div');
      orbit.style.position = 'absolute';
      orbit.style.border = '1px dotted rgba(255, 255, 255, 0.1)';
      orbit.style.borderRadius = '50%';
      orbit.style.width = `${(i + 2) * 40}px`;
      orbit.style.height = `${(i + 2) * 40}px`;
      orbit.style.top = '50%';
      orbit.style.left = '50%';
      orbit.style.marginTop = `-${((i + 2) * 40) / 2}px`;
      orbit.style.marginLeft = `-${((i + 2) * 40) / 2}px`;
      container.appendChild(orbit);

      const planet = document.createElement('div');
      planet.style.width = '15px';
      planet.style.height = '15px';
      planet.style.borderRadius = '50%';
      planet.style.backgroundColor = randomColor();
      planet.style.position = 'absolute';
      planet.style.top = '50%';
      planet.style.left = '50%';
      planet.style.marginTop = '-7.5px';
      planet.style.marginLeft = `${(i + 2) * 40 / 2 - 7.5}px`;
      orbit.appendChild(planet);

      // Animation rotation
      orbit.animate(
        [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(360deg)' }
        ],
        {
          duration: 20000 + i * 1500,
          iterations: Infinity,
          easing: 'linear'
        }
      );
    }
  }, []);

  return <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }} />;
}
