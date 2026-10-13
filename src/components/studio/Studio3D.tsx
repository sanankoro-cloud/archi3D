import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProjectData } from '../../types/architect';
import { Sun, Compass, RotateCcw, Home, Layers, Eye, Clock } from 'lucide-react';

interface Studio3DProps {
  project: ProjectData;
  onSwitchTo2D: () => void;
}

export const Studio3D: React.FC<Studio3DProps> = ({ project, onSwitchTo2D }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sunHour, setSunHour] = useState<number>(14); // 14h00
  const [showRoof, setShowRoof] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'top'>('orbit');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);

  // État de la rotation caméra
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAnglesRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3.5,
    radius: 28,
  });

  // Calcul astronomique simplifié de la position du soleil (Module B PRD)
  const calculateSunPosition = (hour: number) => {
    // 6h = Est (0 rad), 12h = Sud (PI/2 rad), 18h = Ouest (PI rad)
    const progress = (hour - 6) / 14; // 0 to 1
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // Azimut (orientation)
    const azimuth = clampedProgress * Math.PI; // de l'Est vers l'Ouest
    
    // Élévation (hauteur au-dessus de l'horizon)
    const elevation = Math.sin(clampedProgress * Math.PI) * (Math.PI / 2.3);

    const distance = 35;
    const x = Math.cos(azimuth) * Math.cos(elevation) * distance;
    const y = Math.sin(elevation) * distance;
    const z = Math.sin(azimuth) * Math.cos(elevation) * distance;

    // Couleur du ciel et de la lumière
    let lightColor = 0xfffaed;
    let lightIntensity = 1.4;
    if (hour <= 7 || hour >= 19) {
      lightColor = 0xffaa55; // Aube / Crépuscule orangé
      lightIntensity = 0.8;
    } else if (hour <= 9 || hour >= 17) {
      lightColor = 0xffdfa0;
      lightIntensity = 1.1;
    }

    return { x, y: Math.max(2, y), z, lightColor, lightIntensity };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 500;

    // Initialisation Scene Three.js
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Brouillard atmosphérique doux
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.015);

    // Caméra Perspective
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // Renderer WebGL avec ombres douces
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Lumière Ambiante douce
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    // Soleil / Lumière directionnelle avec ombres
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    const d = 25;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Repère du terrain naturel (Sol vert / parcelle)
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grille métrique discrète
    const grid = new THREE.GridHelper(60, 60, 0x94a3b8, 0xcbd5e1);
    grid.position.y = -0.04;
    scene.add(grid);

    // Groupe du Bâtiment
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);
    houseGroupRef.current = houseGroup;

    // Construction 3D à partir des pièces (Extrusion Procédurale)
    build3DModel(houseGroup, project, showRoof);

    // Mise à jour de la caméra
    updateCamera();

    // Boucle d'animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Reconstruire le modèle 3D quand le projet change ou quand le toit est basculé
  useEffect(() => {
    if (houseGroupRef.current) {
      // Vider le groupe existant
      while (houseGroupRef.current.children.length > 0) {
        const obj = houseGroupRef.current.children[0];
        houseGroupRef.current.remove(obj);
      }
      build3DModel(houseGroupRef.current, project, showRoof);
    }
  }, [project, showRoof]);

  // Mettre à jour la course du soleil
  useEffect(() => {
    if (sunLightRef.current) {
      const { x, y, z, lightColor, lightIntensity } = calculateSunPosition(sunHour);
      sunLightRef.current.position.set(x, y, z);
      sunLightRef.current.color.setHex(lightColor);
      sunLightRef.current.intensity = lightIntensity;
    }
  }, [sunHour]);

  const updateCamera = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAnglesRef.current;

    // Centrer sur le bâtiment
    const centerX = project.rooms.reduce((acc, r) => acc + (r.x + r.width / 2), 0) / (project.rooms.length || 1);
    const centerZ = project.rooms.reduce((acc, r) => acc + (r.y + r.length / 2), 0) / (project.rooms.length || 1);

    if (cameraMode === 'top') {
      cameraRef.current.position.set(centerX, radius * 1.2, centerZ + 0.1);
      cameraRef.current.lookAt(centerX, 0, centerZ);
    } else {
      const x = centerX + radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = centerZ + radius * Math.sin(phi) * Math.cos(theta);
      cameraRef.current.position.set(x, Math.max(1, y), z);
      cameraRef.current.lookAt(centerX, 1.2, centerZ);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || cameraMode === 'top') return;

    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;

    cameraAnglesRef.current.theta -= deltaX * 0.008;
    cameraAnglesRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.1, cameraAnglesRef.current.phi - deltaY * 0.008));

    prevMousePos.current = { x: e.clientX, y: e.clientY };
    updateCamera();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraAnglesRef.current.radius = Math.max(8, Math.min(60, cameraAnglesRef.current.radius + e.deltaY * 0.03));
    updateCamera();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Barre de contrôle supérieure 3D */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            Moteur 3D WebGL (Three.js & Extrusion Procédurale)
          </span>
          <span className="text-slate-400">|</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCameraMode('orbit');
                updateCamera();
              }}
              className={`px-2.5 py-1 rounded font-medium ${
                cameraMode === 'orbit'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Orbite 360°
            </button>
            <button
              onClick={() => {
                setCameraMode('top');
                updateCamera();
              }}
              className={`px-2.5 py-1 rounded font-medium ${
                cameraMode === 'top'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Vue Dessus
            </button>
            <button
              onClick={() => setShowRoof(!showRoof)}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 ${
                showRoof
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              {showRoof ? 'Toiture Active' : 'Vue Intérieure (Toit retiré)'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Simulateur Solaire Module B PRD */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg">
            <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">Course Solaire :</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{sunHour}h00</span>
            <input
              type="range"
              min="6"
              max="20"
              step="1"
              value={sunHour}
              onChange={(e) => setSunHour(parseInt(e.target.value, 10))}
              className="w-24 accent-amber-500 cursor-pointer"
            />
          </div>

          <button
            onClick={onSwitchTo2D}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
          >
            ← Retour Plan 2D
          </button>
        </div>
      </div>

      {/* Conteneur WebGL Three.js */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="flex-1 w-full min-h-[520px] cursor-grab active:cursor-grabbing relative select-none"
      >
        {/* Overlay d'aide et Boussole */}
        <div className="absolute bottom-4 left-4 pointer-events-none bg-slate-900/80 backdrop-blur-xs text-white p-3 rounded-xl text-xs space-y-1 border border-slate-800/80 shadow-md">
          <div className="flex items-center gap-1.5 font-bold text-indigo-400">
            <Compass className="w-3.5 h-3.5" />
            Orientation & Ombres Portées
          </div>
          <div>• Clic gauche + Glisser : Tourner autour du bâtiment</div>
          <div>• Molette : Zoomer / Dézoomer</div>
          <div>• Curseur Solaire : Étudier l'ensoleillement des façades</div>
        </div>

        {/* Indicateur de lumière solaire */}
        <div className="absolute top-4 right-4 pointer-events-none bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              {sunHour >= 6 && sunHour < 11
                ? 'Matin (Façade Est)'
                : sunHour >= 11 && sunHour <= 15
                ? 'Zénith (Façade Plein Sud)'
                : 'Après-midi / Soir (Façade Ouest)'}
            </div>
            <div className="text-[10px] text-slate-500">Ombres calculées en temps réel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Algorithme de génération procédurale 3D
function build3DModel(group: THREE.Group, project: ProjectData, showRoof: boolean) {
  const wallHeight = 2.7;
  const wallThickness = 0.20;

  // Matériau des murs extérieurs (Enduit blanc/crème)
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.85,
    metalness: 0.05,
  });

  // Matériau pour les fenêtres (Verre semi-transparent bleuté)
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    transmission: 0.9,
    reflectivity: 0.9,
  });

  // 1. Génération des dalles de sol pour chaque pièce
  project.rooms.forEach((room) => {
    const floorGeo = new THREE.BoxGeometry(room.width, 0.15, room.length);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(room.color || '#e2e8f0'),
      roughness: 0.6,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(room.x + room.width / 2, 0.075, room.y + room.length / 2);
    floorMesh.receiveShadow = true;
    group.add(floorMesh);

    // Murs intérieurs de chaque pièce (4 cloisons)
    const t = 0.10;
    // Mur Haut
    const wTopGeo = new THREE.BoxGeometry(room.width, wallHeight, t);
    const wTop = new THREE.Mesh(wTopGeo, wallMaterial);
    wTop.position.set(room.x + room.width / 2, wallHeight / 2 + 0.15, room.y);
    wTop.castShadow = true;
    wTop.receiveShadow = true;
    group.add(wTop);

    // Mur Bas
    const wBottomGeo = new THREE.BoxGeometry(room.width, wallHeight, t);
    const wBottom = new THREE.Mesh(wBottomGeo, wallMaterial);
    wBottom.position.set(room.x + room.width / 2, wallHeight / 2 + 0.15, room.y + room.length);
    wBottom.castShadow = true;
    wBottom.receiveShadow = true;
    group.add(wBottom);

    // Mur Gauche
    const wLeftGeo = new THREE.BoxGeometry(t, wallHeight, room.length);
    const wLeft = new THREE.Mesh(wLeftGeo, wallMaterial);
    wLeft.position.set(room.x, wallHeight / 2 + 0.15, room.y + room.length / 2);
    wLeft.castShadow = true;
    wLeft.receiveShadow = true;
    group.add(wLeft);

    // Mur Droit
    const wRightGeo = new THREE.BoxGeometry(t, wallHeight, room.length);
    const wRight = new THREE.Mesh(wRightGeo, wallMaterial);
    wRight.position.set(room.x + room.width, wallHeight / 2 + 0.15, room.y + room.length / 2);
    wRight.castShadow = true;
    wRight.receiveShadow = true;
    group.add(wRight);
  });

  // 2. Rendu des ouvertures (Fenêtres & Baies vitrées en verre 3D)
  project.openings.forEach((op) => {
    const isBay = op.type === 'bay_window';
    const glassGeo = new THREE.BoxGeometry(op.width, op.height, 0.18);
    const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
    glassMesh.position.set(op.x, op.elevation + op.height / 2 + 0.15, op.y);
    glassMesh.castShadow = true;
    group.add(glassMesh);

    // Cadre de menuiserie aluminium gris anthracite
    const frameGeo = new THREE.BoxGeometry(op.width + 0.08, op.height + 0.08, 0.06);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(op.x, op.elevation + op.height / 2 + 0.15, op.y);
    group.add(frameMesh);
  });

  // 3. Toiture optionnelle
  if (showRoof) {
    const minX = Math.min(...project.rooms.map(r => r.x));
    const maxX = Math.max(...project.rooms.map(r => r.x + r.width));
    const minY = Math.min(...project.rooms.map(r => r.y));
    const maxY = Math.max(...project.rooms.map(r => r.y + r.length));

    const totalW = maxX - minX + 0.8;
    const totalL = maxY - minY + 0.8;
    const roofY = wallHeight + 0.25;

    // Toiture 2 pans élégante
    const roofGeo = new THREE.ConeGeometry(Math.max(totalW, totalL) * 0.7, 2.2, 4);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x7c2d12, // Tuiles terre cuite
      roughness: 0.8,
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set((minX + maxX) / 2, roofY + 1.1, (minY + maxY) / 2);
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.castShadow = true;
    group.add(roofMesh);
  }
}
