'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type Seat = {
  stand: string;
  block: string;
  row: string;
  seatNum: string;
  id: string; // e.g. "North Stand-A-12-1"
  position: THREE.Vector3;
  colorIndex: number; // 0: Available, 1: Selected, 2: Sold
};

type Props = {
  bookedSeats: string[];
  selectedSeats: any[];
  onSeatToggle: (seatData: any) => void;
  basePrice: number;
};

// Define stands
const STANDS = [
  { name: 'North Stand', pos: new THREE.Vector3(0, 2, -22), lookAt: new THREE.Vector3(0, 0, 0), color: '#3b82f6', rows: 8, cols: 20 },
  { name: 'South Stand', pos: new THREE.Vector3(0, 2, 22), lookAt: new THREE.Vector3(0, 0, 0), color: '#3b82f6', rows: 8, cols: 20 },
  { name: 'East Stand', pos: new THREE.Vector3(22, 2, 0), lookAt: new THREE.Vector3(0, 0, 0), color: '#10b981', rows: 8, cols: 20 },
  { name: 'West Stand', pos: new THREE.Vector3(-22, 2, 0), lookAt: new THREE.Vector3(0, 0, 0), color: '#10b981', rows: 8, cols: 20 },
  { name: 'VIP Pavilion', pos: new THREE.Vector3(-15.5, 3.5, -15.5), lookAt: new THREE.Vector3(0, 0, 0), color: '#f59e0b', rows: 6, cols: 15 },
  { name: 'Premium Stand', pos: new THREE.Vector3(15.5, 3.5, 15.5), lookAt: new THREE.Vector3(0, 0, 0), color: '#8b5cf6', rows: 6, cols: 15 },
];

const SEAT_COLORS = [
  new THREE.Color('#22c55e'), // 0: Available (Green)
  new THREE.Color('#3b82f6'), // 1: Selected (Blue)
  new THREE.Color('#ef4444'), // 2: Sold (Red)
];

export default function InteractiveStadium3D({ bookedSeats, selectedSeats, onSeatToggle, basePrice }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<{ id: string; text: string; x: number; y: number; visible: boolean; type: 'stand' | 'seat' }[]>([]);
  const [viewState, setViewState] = useState<'stadium' | 'stand' | 'seat'>('stadium');

  // Refs for animation & logic
  const targetCameraPos = useRef(new THREE.Vector3(0, 45, 55));
  const targetCameraLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentCameraLook = useRef(new THREE.Vector3(0, 0, 0));
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const zoomStateRef = useRef<'stadium' | 'stand'>('stadium'); // to bypass state closure issues

  // Data refs
  const onSeatToggleRef = useRef(onSeatToggle);
  useEffect(() => {
    onSeatToggleRef.current = onSeatToggle;
  }, [onSeatToggle]);

  const seatsData = useRef<Seat[]>([]);
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    if (container.children.length > 0) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.copy(targetCameraPos.current);
    camera.lookAt(targetCameraLook.current);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Build Stadium Environment
    const buildEnvironment = () => {
      // Pitch
      const pitchGeom = new THREE.CylinderGeometry(15, 15, 0.2, 64);
      pitchGeom.scale(1.2, 1, 0.9);
      const pitchMat = new THREE.MeshLambertMaterial({ color: '#166534' });
      const pitch = new THREE.Mesh(pitchGeom, pitchMat);
      pitch.receiveShadow = true;
      scene.add(pitch);

      // Pitch strip
      const stripGeom = new THREE.BoxGeometry(2, 0.25, 8);
      const stripMat = new THREE.MeshLambertMaterial({ color: '#d1d5db' });
      const strip = new THREE.Mesh(stripGeom, stripMat);
      strip.position.y = 0.05;
      scene.add(strip);

      // Outer bounding ring
      const ringGeom = new THREE.RingGeometry(24, 28, 64);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshLambertMaterial({ color: '#1e293b', side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = 0.1;
      scene.add(ring);
    };
    buildEnvironment();

    // Build Seats
    const buildSeats = () => {
      let totalSeats = 0;
      STANDS.forEach(stand => totalSeats += stand.rows * stand.cols);

      const seatGeom = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const seatMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const instancedMesh = new THREE.InstancedMesh(seatGeom, seatMat, totalSeats);
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;
      instancedMeshRef.current = instancedMesh;
      scene.add(instancedMesh);

      const dummy = new THREE.Object3D();
      let index = 0;
      const allSeats: Seat[] = [];

      STANDS.forEach(stand => {
        const angle = Math.atan2(stand.pos.x, stand.pos.z);

        for (let r = 0; r < stand.rows; r++) {
          for (let c = 0; c < stand.cols; c++) {
            const block = c < stand.cols / 2 ? 'A' : 'B';
            const rowStr = (r + 1).toString();
            const seatNumInBlock = block === 'A' ? c + 1 : c - Math.ceil(stand.cols / 2) + 1;
            const seatNumStr = seatNumInBlock.toString();

            const fullId = `${stand.name}-${block}-${rowStr}-${seatNumStr}`;

            const radius = stand.pos.length() + r * 0.8;
            const thetaOffset = (c - stand.cols / 2) * 0.04;
            const finalAngle = angle + thetaOffset;

            const x = Math.sin(finalAngle) * radius;
            const z = Math.cos(finalAngle) * radius;
            const y = stand.pos.y + r * 0.4;

            dummy.position.set(x, y, z);
            dummy.lookAt(0, dummy.position.y, 0);
            dummy.updateMatrix();

            instancedMesh.setMatrixAt(index, dummy.matrix);
            instancedMesh.setColorAt(index, SEAT_COLORS[0]);

            allSeats.push({
              stand: stand.name,
              block,
              row: rowStr,
              seatNum: seatNumStr,
              id: fullId,
              position: dummy.position.clone(),
              colorIndex: 0
            });

            index++;
          }
        }
      });
      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
      seatsData.current = allSeats;
    };
    buildSeats();

    const updateSeatColors = () => {
      if (!instancedMeshRef.current) return;
      const selectedSet = new Set(selectedSeats.map(s => s.id || `${s.stand}-${s.block}-${s.row}-${s.seat}`));

      seatsData.current.forEach((seat, idx) => {
        const standBlockSeat = `${seat.stand}-${seat.block}-${seat.seatNum}`;
        let isBooked = bookedSeats.includes(standBlockSeat) || bookedSeats.includes(seat.id);

        let colorIdx = 0;
        if (isBooked) colorIdx = 2;
        else if (selectedSet.has(seat.id)) colorIdx = 1;

        seat.colorIndex = colorIdx;
        instancedMeshRef.current!.setColorAt(idx, SEAT_COLORS[colorIdx]);
      });

      if (instancedMeshRef.current.instanceColor) {
        instancedMeshRef.current.instanceColor.needsUpdate = true;
      }
    };
    updateSeatColors();

    const zoomToStand = (standName: string) => {
      const stand = STANDS.find(s => s.name === standName);
      if (!stand) return;

      const dir = stand.pos.clone().normalize();
      targetCameraPos.current.copy(dir.multiplyScalar(8)).setY(15);
      targetCameraLook.current.copy(stand.pos);
      setViewState('stand');
      zoomStateRef.current = 'stand';
    };

    const zoomToStadium = () => {
      targetCameraPos.current.set(0, 45, 55);
      targetCameraLook.current.set(0, 0, 0);
      setViewState('stadium');
      zoomStateRef.current = 'stadium';
    };

    (window as any).triggerZoomToStadium = zoomToStadium;

    let hoverIndex: number | null = null;
    let hoveredSeatHtmlId: string | null = null;

    const handlePointerMove = (e: MouseEvent) => {
      if (zoomStateRef.current !== 'stand') return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      if (instancedMeshRef.current) {
        const intersects = raycaster.current.intersectObject(instancedMeshRef.current);
        if (intersects.length > 0) {
          const instanceId = intersects[0].instanceId;
          if (instanceId !== undefined && instanceId !== hoverIndex) {
            hoverIndex = instanceId;
            const seat = seatsData.current[instanceId];
            hoveredSeatHtmlId = seat.id;
          }
        } else {
          hoverIndex = null;
          hoveredSeatHtmlId = null;
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      if (instancedMeshRef.current) {
        const intersects = raycaster.current.intersectObject(instancedMeshRef.current);
        if (intersects.length > 0) {
          const instanceId = intersects[0].instanceId;
          if (instanceId !== undefined) {
            const seat = seatsData.current[instanceId];

            if (zoomStateRef.current === 'stadium') {
              zoomToStand(seat.stand);
            } else {
              if (seat.colorIndex !== 2) {

                const getPrice = (standName: string) => {
                  if (standName.includes('VIP')) return 3000;
                  if (standName.includes('Premium')) return 2000;
                  if (standName.includes('East') || standName.includes('West')) return 1000;
                  return 800;
                };

                onSeatToggleRef.current({
                  stand: seat.stand,
                  block: seat.block,
                  row: seat.row,
                  seat: seat.seatNum,
                  price: getPrice(seat.stand),
                  id: seat.id
                });
              }
            }
          }
        } else {
          if (zoomStateRef.current !== 'stadium') {
            zoomToStadium();
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      camera.position.lerp(targetCameraPos.current, 0.08);
      currentCameraLook.current.lerp(targetCameraLook.current, 0.08);
      camera.lookAt(currentCameraLook.current);

      const newLabels: typeof labels = [];

      if (camera.position.distanceTo(targetCameraPos.current) < 2) {
        if (zoomStateRef.current === 'stadium') {
          STANDS.forEach(stand => {
            const pos = stand.pos.clone().setY(stand.pos.y + 4);
            pos.project(camera);
            if (pos.z < 1) {
              newLabels.push({
                id: stand.name,
                text: stand.name,
                x: (pos.x * 0.5 + 0.5) * width,
                y: (-pos.y * 0.5 + 0.5) * height,
                visible: true,
                type: 'stand'
              });
            }
          });
        } else if (zoomStateRef.current === 'stand' && hoveredSeatHtmlId) {
          const seat = seatsData.current.find(s => s.id === hoveredSeatHtmlId);
          if (seat) {
            const pos = seat.position.clone().setY(seat.position.y + 1);
            pos.project(camera);
            if (pos.z < 1) {
              newLabels.push({
                id: seat.id,
                text: `Block ${seat.block} - Row ${seat.row} - Seat ${seat.seatNum}`,
                x: (pos.x * 0.5 + 0.5) * width,
                y: (-pos.y * 0.5 + 0.5) * height,
                visible: true,
                type: 'seat'
              });
            }
          }
        }
      }

      setLabels(newLabels);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      delete (window as any).triggerZoomToStadium;
    };
  }, []);

  useEffect(() => {
    if (!instancedMeshRef.current || seatsData.current.length === 0) return;
    const selectedSet = new Set(selectedSeats.map(s => s.id || `${s.stand}-${s.block}-${s.row}-${s.seat}`));

    seatsData.current.forEach((seat, idx) => {
      const standBlockSeat = `${seat.stand}-${seat.block}-${seat.seatNum}`;
      let isBooked = bookedSeats.includes(standBlockSeat) || bookedSeats.includes(seat.id);

      let colorIdx = 0;
      if (isBooked) colorIdx = 2;
      else if (selectedSet.has(seat.id)) colorIdx = 1;

      if (seat.colorIndex !== colorIdx) {
        seat.colorIndex = colorIdx;
        instancedMeshRef.current!.setColorAt(idx, SEAT_COLORS[colorIdx]);
      }
    });

    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [bookedSeats, selectedSeats]);

  return (
    <div className="relative w-full h-full min-h-[650px] rounded-3xl overflow-hidden bg-transparent">
      {viewState !== 'stadium' && (
        <button
          className="absolute top-4 left-4 z-20 bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-sm font-label-caps uppercase tracking-widest hover:bg-surface-container-highest/80 transition-colors"
          onClick={() => {
            if ((window as any).triggerZoomToStadium) (window as any).triggerZoomToStadium();
          }}
        >
          ← Back to Stadium
        </button>
      )}

      <div className="absolute top-4 right-4 z-20 flex gap-4 bg-surface-container/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs font-label-caps uppercase">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#22c55e] rounded-full"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#3b82f6] rounded-full"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ef4444] rounded-full"></div> Sold</div>
      </div>

      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer" />

      {labels.map(label => (
        <div
          key={label.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300"
          style={{
            left: `${label.x}px`,
            top: `${label.y}px`,
            opacity: label.visible ? 1 : 0
          }}
        >
          <div className="bg-surface-container-highest/90 text-on-surface px-3 py-1.5 rounded-lg text-xs font-label-caps tracking-widest border border-white/10 shadow-lg backdrop-blur whitespace-nowrap">
            {label.text}
          </div>
        </div>
      ))}
    </div>
  );
}
