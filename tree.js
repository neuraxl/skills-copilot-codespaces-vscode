// Galaxies interactives pour la visualisation du cerveau
// À intégrer dans votre code Three.js existant

class GalacticBrainVisualization {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.galaxies = [];
    this.solarSystems = {};
    this.civilizations = {};
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedGalaxy = null;
    this.selectedPlanet = null;
    this.zoomedIn = false;
    this.zoomLevel = 0; // 0 = brain view, 1 = galaxy view, 2 = solar system view, 3 = civilization view

    // Configuration
    this.GALAXY_COUNT = 100;
    this.PLANETS_PER_SYSTEM = 12;
    
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener('click', this.onClick.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  initialize() {
    this.createGalaxies();
    this.createSolarSystems();
    this.createCivilizations();
  }

  createGalaxies() {
    // Positions réparties dans la forme du cerveau
    const brainBoundingBox = this.calculateBrainBoundingBox();
    
    for (let i = 0; i < this.GALAXY_COUNT; i++) {
      // Création de la galaxie
      const galaxyGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const galaxyMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
      });
      
      const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
      
      // Position aléatoire dans les limites du cerveau
      galaxy.position.x = brainBoundingBox.minX + Math.random() * (brainBoundingBox.maxX - brainBoundingBox.minX);
      galaxy.position.y = brainBoundingBox.minY + Math.random() * (brainBoundingBox.maxY - brainBoundingBox.minY);
      galaxy.position.z = brainBoundingBox.minZ + Math.random() * (brainBoundingBox.maxZ - brainBoundingBox.minZ);
      
      // Création du halo bleu
      const haloGeometry = new THREE.SphereGeometry(1.5, 32, 32);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.3
      });
      
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      galaxy.add(halo);
      
      // Ajout d'un identifiant
      galaxy.userData = {
        type: "galaxy",
        id: i
      };
      
      this.galaxies.push(galaxy);
      this.scene.add(galaxy);
    }
  }
  
  createSolarSystems() {
    this.galaxies.forEach((galaxy, galaxyIndex) => {
      const solarSystem = new THREE.Group();
      
      // Étoile centrale
      const starGeometry = new THREE.SphereGeometry(3, 32, 32);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 2
      });
      
      const star = new THREE.Mesh(starGeometry, starMaterial);
      solarSystem.add(star);
      
      // Orbites et planètes
      for (let i = 0; i < this.PLANETS_PER_SYSTEM; i++) {
        // Orbite
        const orbitRadius = 5 + i * 2;
        const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.1, orbitRadius + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x888888,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        });
        
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        solarSystem.add(orbit);
        
        // Planète
        const planetSize = 0.5 + Math.random() * 0.8;
        const planetGeometry = new THREE.SphereGeometry(planetSize, 32, 32);
        
        // Couleurs variées pour les planètes
        const planetColors = [0x3366ff, 0x33cc33, 0xcc6633, 0x9933cc, 0xffcc00, 0xff6699];
        const planetMaterial = new THREE.MeshPhongMaterial({
          color: planetColors[i % planetColors.length],
          specular: 0x333333,
          shininess: 30
        });
        
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Position sur l'orbite
        const angle = (i / this.PLANETS_PER_SYSTEM) * Math.PI * 2;
        planet.position.x = Math.cos(angle) * orbitRadius;
        planet.position.z = Math.sin(angle) * orbitRadius;
        
        // Identifiant de la planète
        planet.userData = {
          type: "planet",
          galaxyId: galaxyIndex,
          planetId: i
        };
        
        solarSystem.add(planet);
      }
      
      // Masquage initial du système
      solarSystem.visible = false;
      
      // Stockage du système solaire
      this.solarSystems[galaxyIndex] = solarSystem;
      this.scene.add(solarSystem);
    });
  }
  
  createCivilizations() {
    for (let galaxyIndex = 0; galaxyIndex < this.GALAXY_COUNT; galaxyIndex++) {
      this.civilizations[galaxyIndex] = {};
      
      for (let planetIndex = 0; planetIndex < this.PLANETS_PER_SYSTEM; planetIndex++) {
        const civilization = new THREE.Group();
        
        // Création d'une cité de type égyptien avec des pyramides et structures
        const citySize = 20;
        const buildingCount = 50;
        
        // Terrain plat
        const terrainGeometry = new THREE.CircleGeometry(citySize, 32);
        const terrainMaterial = new THREE.MeshStandardMaterial({
          color: 0xddcc88,
          roughness: 0.8
        });
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 2;
        civilization.add(terrain);
        
        // Pyramides et bâtiments
        for (let b = 0; b < buildingCount; b++) {
          let building;
          
          if (b < 5) {
            // Grandes pyramides
            const pyramidGeometry = new THREE.ConeGeometry(1 + Math.random(), 2 + Math.random() * 3, 4);
            const pyramidMaterial = new THREE.MeshStandardMaterial({
              color: 0xddddaa,
              roughness: 0.7
            });
            building = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
          } else if (b < 15) {
            // Temples et palais
            const templeGeometry = new THREE.BoxGeometry(
              1 + Math.random() * 2,
              0.5 + Math.random() * 1.5,
              1 + Math.random() * 2
            );
            const templeMaterial = new THREE.MeshStandardMaterial({
              color: 0xccaa88,
              roughness: 0.6
            });
            building = new THREE.Mesh(templeGeometry, templeMaterial);
          } else {
            // Petites habitations
            const houseGeometry = new THREE.BoxGeometry(
              0.5 + Math.random() * 0.5,
              0.5 + Math.random() * 0.5,
              0.5 + Math.random() * 0.5
            );
            const houseMaterial = new THREE.MeshStandardMaterial({
              color: 0xbbaa99,
              roughness: 0.9
            });
            building = new THREE.Mesh(houseGeometry, houseMaterial);
          }
          
          // Position aléatoire dans la cité
          const radius = Math.random() * citySize * 0.9;
          const angle = Math.random() * Math.PI * 2;
          building.position.x = Math.cos(angle) * radius;
          building.position.z = Math.sin(angle) * radius;
          
          // Rotation aléatoire
          building.rotation.y = Math.random() * Math.PI * 2;
          
          civilization.add(building);
        }
        
        // Quelques titans géants (statues)
        for (let t = 0; t < 3; t++) {
          const titanHeight = 2 + Math.random() * 2;
          
          // Corps du titan
          const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, titanHeight * 0.6, 8);
          const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xddccbb,
            roughness: 0.5
          });
          const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
          
          // Tête du titan
          const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
          const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xddccbb,
            roughness: 0.5
          });
          const head = new THREE.Mesh(headGeometry, headMaterial);
          head.position.y = titanHeight * 0.3 + 0.1;
          
          // Groupe du titan
          const titan = new THREE.Group();
          titan.add(body);
          titan.add(head);
          
          // Position du titan
          const titanRadius = citySize * 0.3 + Math.random() * citySize * 0.2;
          const titanAngle = t * (Math.PI * 2 / 3);
          titan.position.x = Math.cos(titanAngle) * titanRadius;
          titan.position.z = Math.sin(titanAngle) * titanRadius;
          titan.position.y = titanHeight * 0.3;
          
          civilization.add(titan);
        }
        
        // Lumières pour la scène
        const ambientLight = new THREE.AmbientLight(0xffffcc, 0.5);
        civilization.add(ambientLight);
        
        const sunLight = new THREE.DirectionalLight(0xffffaa, 1);
        sunLight.position.set(50, 50, 0);
        civilization.add(sunLight);
        
        // Masquage initial
        civilization.visible = false;
        
        // Stockage de la civilisation
        this.civilizations[galaxyIndex][planetIndex] = civilization;
        this.scene.add(civilization);
      }
    }
  }
  
  calculateBrainBoundingBox() {
    // Cette fonction doit être adaptée à votre modèle 3D de cerveau
    // Elle retourne les limites dans lesquelles placer les galaxies
    // À ajuster selon les dimensions de votre modèle de cerveau
    return {
      minX: -50,
      maxX: 50,
      minY: -30,
      maxY: 50,
      minZ: -50,
      maxZ: 50
    };
  }
  
  onClick(event) {
    event.preventDefault();
    
    // Calcul de la position de la souris normalisée
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Mise à jour du raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    if (this.zoomLevel === 0) {
      // En vue cerveau, on cherche des galaxies
      const intersects = this.raycaster.intersectObjects(this.galaxies);
      
      if (intersects.length > 0) {
        this.zoomToGalaxy(intersects[0].object);
      }
    } 
    else if (this.zoomLevel === 1) {
      // En vue galaxie, on cherche des planètes
      const solarSystem = this.solarSystems[this.selectedGalaxy.userData.id];
      const planets = solarSystem.children.filter(child => child.userData && child.userData.type === "planet");
      const intersects = this.raycaster.intersectObjects(planets);
      
      if (intersects.length > 0) {
        this.zoomToPlanet(intersects[0].object);
      } else {
        // Clic en dehors d'une planète = retour à la vue cerveau
        this.zoomOutToGalaxy();
      }
    }
    else if (this.zoomLevel === 2) {
      // En vue planète/civilisation, clic = retour à la vue système solaire
      this.zoomOutToPlanet();
    }
  }
  
  onMouseMove(event) {
    // Mise à jour position souris pour effets hover
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Raycasting pour effets hover
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    if (this.zoomLevel === 0) {
      // Hover sur les galaxies
      const intersects = this.raycaster.intersectObjects(this.galaxies);
      
      // Reset tous les halos
      this.galaxies.forEach(galaxy => {
        const halo = galaxy.children[0];
        halo.material.opacity = 0.3;
        galaxy.scale.set(1, 1, 1);
      });
      
      // Highlight de la galaxie survolée
      if (intersects.length > 0) {
        const hoveredGalaxy = intersects[0].object;
        const halo = hoveredGalaxy.children[0];
        halo.material.opacity = 0.6;
        hoveredGalaxy.scale.set(1.2, 1.2, 1.2);
      }
    }
    else if (this.zoomLevel === 1) {
      // Hover sur les planètes
      const solarSystem = this.solarSystems[this.selectedGalaxy.userData.id];
      const planets = solarSystem.children.filter(child => child.userData && child.userData.type === "planet");
      const intersects = this.raycaster.intersectObjects(planets);
      
      // Reset toutes les planètes
      planets.forEach(planet => {
        planet.scale.set(1, 1, 1);
      });
      
      // Highlight de la planète survolée
      if (intersects.length > 0) {
        const hoveredPlanet = intersects[0].object;
        hoveredPlanet.scale.set(1.3, 1.3, 1.3);
      }
    }
  }
  
  onKeyDown(event) {
    // Touche Echap pour revenir en arrière dans la navigation
    if (event.key === "Escape") {
      if (this.zoomLevel === 1) {
        this.zoomOutToGalaxy();
      }
      else if (this.zoomLevel === 2) {
        this.zoomOutToPlanet();
      }
    }
  }
  
  zoomToGalaxy(galaxy) {
    this.selectedGalaxy = galaxy;
    this.zoomLevel = 1;
    
    // Masquer les autres galaxies
    this.galaxies.forEach(g => {
      g.visible = false;
    });
    
    // Afficher le système solaire correspondant
    const solarSystem = this.solarSystems[galaxy.userData.id];
    solarSystem.visible = true;
    
    // Position du système solaire à la position de la galaxie
    solarSystem.position.copy(galaxy.position);
    
    // Animation de caméra vers le système solaire
    const targetPosition = new THREE.Vector3(
      galaxy.position.x,
      galaxy.position.y,
      galaxy.position.z + 30
    );
    
    // Animer la caméra (à adapter avec votre système d'animation)
    this.animateCamera(targetPosition, new THREE.Vector3(galaxy.position.x, galaxy.position.y, galaxy.position.z));
  }
  
  zoomToPlanet(planet) {
    this.selectedPlanet = planet;
    this.zoomLevel = 2;
    
    // Récupérer les données de la planète
    const galaxyId = planet.userData.galaxyId;
    const planetId = planet.userData.planetId;
    
    // Masquer le système solaire
    this.solarSystems[galaxyId].visible = false;
    
    // Afficher la civilisation correspondante
    const civilization = this.civilizations[galaxyId][planetId];
    civilization.visible = true;
    
    // Position de la civilisation à la position de la planète dans le monde
    const worldPosition = new THREE.Vector3();
    planet.getWorldPosition(worldPosition);
    civilization.position.copy(worldPosition);
    
    // Animation de caméra vers la civilisation
    const targetPosition = new THREE.Vector3(
      worldPosition.x,
      worldPosition.y + 15,
      worldPosition.z + 15
    );
    
    // Animer la caméra
    this.animateCamera(targetPosition, worldPosition);
  }
  
  zoomOutToGalaxy() {
    if (this.selectedGalaxy) {
      this.zoomLevel = 0;
      
      // Masquer le système solaire
      const solarSystem = this.solarSystems[this.selectedGalaxy.userData.id];
      solarSystem.visible = false;
      
      // Afficher toutes les galaxies
      this.galaxies.forEach(g => {
        g.visible = true;
      });
      
      // Animation de la caméra pour revenir à la vue du cerveau
      const targetPosition = new THREE.Vector3(0, 0, 100); // Position initiale de la caméra
      const targetLookAt = new THREE.Vector3(0, 0, 0); // Point central du cerveau
      
      // Animer la caméra
      this.animateCamera(targetPosition, targetLookAt);
      
      this.selectedGalaxy = null;
    }
  }
  
  zoomOutToPlanet() {
    if (this.selectedGalaxy && this.selectedPlanet) {
      this.zoomLevel = 1;
      
      // Masquer la civilisation
      const galaxyId = this.selectedPlanet.userData.galaxyId;
      const planetId = this.selectedPlanet.userData.planetId;
      this.civilizations[galaxyId][planetId].visible = false;
      
      // Réafficher le système solaire
      this.solarSystems[galaxyId].visible = true;
      
      // Animation de caméra pour revenir à la vue du système solaire
      const galaxyPosition = this.selectedGalaxy.position;
      const targetPosition = new THREE.Vector3(
        galaxyPosition.x,
        galaxyPosition.y,
        galaxyPosition.z + 30
      );
      
      // Animer la caméra
      this.animateCamera(targetPosition, galaxyPosition);
      
      this.selectedPlanet = null;
    }
  }
  
  animateCamera(targetPosition, targetLookAt) {
    // Cette fonction doit être adaptée à votre système d'animation
    // Exemple simple avec GSAP ou TweenJS (à adapter selon votre choix)
    
    // Exemple conceptuel:
    // TweenMax.to(this.camera.position, 2, {
    //   x: targetPosition.x,
    //   y: targetPosition.y,
    //   z: targetPosition.z,
    //   ease: Power2.easeInOut,
    //   onUpdate: () => {
    //     this.camera.lookAt(targetLookAt);
    //   }
    // });
    
    // Alternative en natif si vous n'utilisez pas de librairie d'animation
    this.animationStartTime = Date.now();
    this.animationDuration = 2000; // durée en ms
    this.cameraStartPosition = this.camera.position.clone();
    this.cameraTargetPosition = targetPosition;
    this.cameraTargetLookAt = targetLookAt;
    
    // Suppression d'une animation existante si nécessaire
    if (this.cameraAnimationFrame) {
      cancelAnimationFrame(this.cameraAnimationFrame);
    }
    
    // Lancement de l'animation
    this.animateCameraFrame();
  }
  
  animateCameraFrame() {
    const now = Date.now();
    const elapsed = now - this.animationStartTime;
    let progress = Math.min(elapsed / this.animationDuration, 1);
    
    // Fonction d'easing
    progress = this.easeInOutQuad(progress);
    
    // Mise à jour position caméra
    this.camera.position.x = this.cameraStartPosition.x + (this.cameraTargetPosition.x - this.cameraStartPosition.x) * progress;
    this.camera.position.y = this.cameraStartPosition.y + (this.cameraTargetPosition.y - this.cameraStartPosition.y) * progress;
    this.camera.position.z = this.cameraStartPosition.z + (this.cameraTargetPosition.z - this.cameraStartPosition.z) * progress;
    
    // Orientation caméra
    this.camera.lookAt(this.cameraTargetLookAt);
    
    // Continuer l'animation si nécessaire
    if (progress < 1) {
      this.cameraAnimationFrame = requestAnimationFrame(this.animateCameraFrame.bind(this));
    }
  }
  
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  
  update() {
    // Animation continue des éléments
    if (this.zoomLevel === 1) {
      // Animation du système solaire
      const solarSystem = this.solarSystems[this.selectedGalaxy.userData.id];
      const planets = solarSystem.children.filter(child => child.userData && child.userData.type === "planet");
      
      planets.forEach(planet => {
        // Rotation des planètes autour du soleil
        const orbitSpeed = 0.002 / (planet.userData.planetId + 1);
        const orbitRadius = 5 + planet.userData.planetId * 2;
        
        // Position actuelle
        const currentX = planet.position.x;
        const currentZ = planet.position.z;
        
        // Calcul de l'angle actuel
        let angle = Math.atan2(currentZ, currentX);
        angle += orbitSpeed;
        
        // Nouvelle position
        planet.position.x = Math.cos(angle) * orbitRadius;
        planet.position.z = Math.sin(angle) * orbitRadius;
        
        // Rotation sur elle-même
        planet.rotation.y += 0.01;
      });
    }
    
    // Animation des halos de galaxies en vue cerveau
    if (this.zoomLevel === 0) {
      this.galaxies.forEach(galaxy => {
        const halo = galaxy.children[0];
        halo.rotation.y += 0.005;
        halo.rotation.x += 0.003;
        
        // Pulsation légère
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time) * 0.1 + 1;
        halo.scale.set(pulse, pulse, pulse);
      });
    }
  }
}

// -----------------------------------------------------
// Intégration dans le code existant
// -----------------------------------------------------

// À adapter selon votre structure de code actuelle

// 1. Initialisation après le chargement du modèle du cerveau
function initializeGalacticBrainVisualization(scene, camera, renderer) {
  const galaxyBrain = new GalacticBrainVisualization(scene, camera, renderer);
  galaxyBrain.initialize();
  
  // Intégration dans la boucle d'animation existante
  function animateWithGalaxies() {
    requestAnimationFrame(animateWithGalaxies);
    
    // Mise à jour des animations des galaxies
    galaxyBrain.update();
    
    // Reste de votre code d'animation
    renderer.render(scene, camera);
  }
  
  // Démarrer l'animation
  animateWithGalaxies();
  
  return galaxyBrain;
}

// 2. Ajout d'instructions pour l'utilisateur
function addGalaxyInstructions() {
  const instructions = document.createElement('div');
  instructions.style.position = 'absolute';
  instructions.style.bottom = '20px';
  instructions.style.left = '20px';
  instructions.style.color = 'white';
  instructions.style.fontFamily = 'Arial, sans-serif';
  instructions.style.fontSize = '14px';
  instructions.style.padding = '10px';
  instructions.style.background = 'rgba(0,0,0,0.5)';
  instructions.style.borderRadius = '5px';
  instructions.style.pointerEvents = 'none';
  instructions.textContent = 'Cliquez sur les galaxies pour explorer les systèmes solaires et les civilisations. Appuyez sur ESC pour revenir en arrière.';
  
  document.body.appendChild(instructions);
}

// 3. Utilisation
// À placer dans votre code existant là où vous initialisez la visualisation du cerveau
/*
document.addEventListener('DOMContentLoaded', function() {
  // Votre code d'initialisation Three.js

  // Initialisation des galaxies
  const galaxyBrain = initializeGalacticBrainVisualization(scene, camera, renderer);
  
  // Ajout des instructions
  addGalaxyInstructions();
});
*/
