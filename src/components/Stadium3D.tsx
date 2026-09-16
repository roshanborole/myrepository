"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { floodlightStore } from "@/store/floodlight";

export default function Stadium3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    
    // Check if renderer already exists to prevent double rendering in React Strict Mode
    if (container.children.length > 0) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const spots: THREE.SpotLight[] = [];
    const cones: THREE.Material[] = [];
    const neons: THREE.Material[] = [];
    const baseLightIntensities = { ambient: 1.4, hemi: 0.45, sun: 0.9, spot: 5.5, cone: 0.09, neon: 0.85 };

    scene.fog = new THREE.FogExp2(0x06080b, 0.028);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 17.5, 27);
    camera.lookAt(0, -1.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x0a1612, 1.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38ef7d, 0x05080c, 0.45);
    scene.add(hemiLight);

    const directionalSun = new THREE.DirectionalLight(0xdcfce7, 0.9);
    directionalSun.position.set(15, 35, 22);
    scene.add(directionalSun);

    // Procedural Textures
    function createGrassCanvas() {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 1024;
      const ctx = c.getContext('2d');
      if (!ctx) return c;
      ctx.fillStyle = '#188647';
      ctx.fillRect(0, 0, 1024, 1024);
      
      for (let i = 0; i < 1024; i += 32) {
        ctx.fillStyle = (i / 32) % 2 === 0 ? 'rgba(39, 174, 96, 0.35)' : 'rgba(18, 105, 52, 0.35)';
        ctx.fillRect(0, i, 1024, 32);
      }
      
      for (let n = 0; n < 30000; n++) {
        const rx = Math.random() * 1024;
        const ry = Math.random() * 1024;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(46, 204, 113, 0.12)' : 'rgba(10, 60, 30, 0.15)';
        ctx.fillRect(rx, ry, 2, 3);
      }
      return c;
    }

    function createSeatingCanvas() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      if (!ctx) return c;
      ctx.fillStyle = '#14181e';
      ctx.fillRect(0, 0, 512, 512);
      for (let y = 0; y < 512; y += 8) {
        ctx.fillStyle = '#1b2028';
        ctx.fillRect(0, y, 512, 4);
        ctx.fillStyle = '#0f1217';
        ctx.fillRect(0, y + 4, 512, 4);
      }
      return c;
    }

    const grassTexture = new THREE.CanvasTexture(createGrassCanvas());
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(4, 4);

    const seatTexture = new THREE.CanvasTexture(createSeatingCanvas());
    seatTexture.wrapS = THREE.RepeatWrapping;
    seatTexture.wrapT = THREE.RepeatWrapping;
    seatTexture.repeat.set(16, 2);

    const stadiumGroup = new THREE.Group();
    scene.add(stadiumGroup);

    // 1. OVAL CRICKET FIELD
    const fieldGeom = new THREE.CylinderGeometry(9.6, 9.6, 0.4, 80);
    fieldGeom.scale(1.18, 1, 0.92);
    const fieldMat = new THREE.MeshLambertMaterial({ color: 0x22c55e, map: grassTexture });
    const fieldMesh = new THREE.Mesh(fieldGeom, fieldMat);
    fieldMesh.position.y = 0;
    fieldMesh.receiveShadow = true;
    stadiumGroup.add(fieldMesh);

    const innerFieldGeom = new THREE.CylinderGeometry(5.9, 5.9, 0.42, 64);
    innerFieldGeom.scale(1.18, 1, 0.92);
    const innerFieldMat = new THREE.MeshLambertMaterial({ color: 0x16a34a, map: grassTexture });
    const innerField = new THREE.Mesh(innerFieldGeom, innerFieldMat);
    innerField.position.y = 0.01;
    stadiumGroup.add(innerField);

    const ropeGeom = new THREE.TorusGeometry(9.5, 0.07, 8, 80);
    ropeGeom.scale(1.18, 0.92, 1);
    ropeGeom.rotateX(Math.PI / 2);
    const ropeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rope = new THREE.Mesh(ropeGeom, ropeMat);
    rope.position.y = 0.22;
    stadiumGroup.add(rope);

    const circle30Geom = new THREE.TorusGeometry(5.85, 0.045, 8, 64);
    circle30Geom.scale(1.18, 0.92, 1);
    circle30Geom.rotateX(Math.PI / 2);
    const circle30Mat = new THREE.MeshBasicMaterial({ color: 0x86efac });
    const circle30 = new THREE.Mesh(circle30Geom, circle30Mat);
    circle30.position.y = 0.23;
    stadiumGroup.add(circle30);

    const pitchStrip = new THREE.Group();
    const clayGeom = new THREE.BoxGeometry(1.28, 0.45, 4.0);
    const clayMat = new THREE.MeshLambertMaterial({ color: 0xd6c29a });
    const clayMesh = new THREE.Mesh(clayGeom, clayMat);
    clayMesh.position.set(0, 0.02, 0);
    pitchStrip.add(clayMesh);

    const creaseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-1.5, 1.5].forEach(z => {
      const popCrease = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.47, 0.06), creaseMat);
      popCrease.position.set(0, 0.03, z);
      pitchStrip.add(popCrease);
      
      [-0.55, 0.55].forEach(x => {
        const retCrease = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.47, 0.6), creaseMat);
        retCrease.position.set(x, 0.03, z + (z > 0 ? 0.25 : -0.25));
        pitchStrip.add(retCrease);
      });
    });

    const stumpMat = new THREE.MeshLambertMaterial({ color: 0xfef08a });
    const bailMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    [-1.6, 1.6].forEach(z => {
      [-0.16, 0, 0.16].forEach(x => {
        const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 8), stumpMat);
        stump.position.set(x, 0.4, z);
        pitchStrip.add(stump);
      });
      const bail = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.03), bailMat);
      bail.position.set(0, 0.6, z);
      pitchStrip.add(bail);
    });
    stadiumGroup.add(pitchStrip);

    // 2. ARCHITECTURAL GRANDSTAND TIERS & CORPORATE SUITES
    const tierLevels = [
      { rBot: 10.1, rTop: 11.2, h: 0.65, y: 0.2, col: 0x181e26, neon: true },
      { rBot: 11.3, rTop: 12.5, h: 0.75, y: 0.7, col: 0x222a36, neon: false },
      { rBot: 12.6, rTop: 13.9, h: 0.85, y: 1.3, col: 0x161a22, neon: true },
      { rBot: 14.0, rTop: 15.3, h: 0.95, y: 2.0, col: 0x242d3a, neon: false },
      { rBot: 15.4, rTop: 16.8, h: 1.05, y: 2.8, col: 0x151820, neon: true }
    ];

    tierLevels.forEach((t) => {
      const tierGeom = new THREE.CylinderGeometry(t.rTop, t.rBot, t.h, 72, 1, true);
      tierGeom.scale(1.16, 1, 0.92);
      const tierMat = new THREE.MeshLambertMaterial({ color: t.col, map: seatTexture, side: THREE.DoubleSide });
      const tier = new THREE.Mesh(tierGeom, tierMat);
      tier.position.y = t.y;
      stadiumGroup.add(tier);

      const ringGeom = new THREE.TorusGeometry(t.rTop * 1.006, 0.045, 6, 72);
      ringGeom.scale(1.16, 0.92, 1);
      ringGeom.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: t.neon ? 0x00ff87 : 0x3b82f6, transparent: true, opacity: t.neon ? 0.85 : 0.35 });
      if (t.neon) neons.push(ringMat);
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = t.y + t.h * 0.5 + 0.02;
      stadiumGroup.add(ring);
    });

    const vipBandGeom = new THREE.CylinderGeometry(14.05, 13.95, 0.38, 72, 1, true);
    vipBandGeom.scale(1.16, 1, 0.92);
    const vipBandMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.75, side: THREE.DoubleSide });
    const vipBand = new THREE.Mesh(vipBandGeom, vipBandMat);
    vipBand.position.y = 1.95;
    stadiumGroup.add(vipBand);

    const adBoardGeom = new THREE.CylinderGeometry(9.9, 9.8, 0.3, 80, 1, true);
    adBoardGeom.scale(1.17, 1, 0.92);
    const adBoardMat = new THREE.MeshBasicMaterial({ color: 0x059669, side: THREE.DoubleSide });
    const adBoard = new THREE.Mesh(adBoardGeom, adBoardMat);
    adBoard.position.y = 0.28;
    stadiumGroup.add(adBoard);

    // 3. ARCHITECTURAL OUTER SHELL
    const facadeGeom = new THREE.CylinderGeometry(17.4, 16.0, 3.8, 72, 1, true);
    facadeGeom.scale(1.16, 1, 0.92);
    const facadeMat = new THREE.MeshLambertMaterial({ color: 0x0a0c10, side: THREE.DoubleSide });
    const facade = new THREE.Mesh(facadeGeom, facadeMat);
    facade.position.y = 1.9;
    stadiumGroup.add(facade);

    const roofCanopyGeom = new THREE.RingGeometry(13.8, 18.2, 72);
    roofCanopyGeom.rotateX(-Math.PI / 2);
    roofCanopyGeom.scale(1.16, 1, 0.92);
    const roofCanopyMat = new THREE.MeshLambertMaterial({ color: 0x1e242d, side: THREE.DoubleSide });
    const roofCanopy = new THREE.Mesh(roofCanopyGeom, roofCanopyMat);
    roofCanopy.position.y = 4.0;
    stadiumGroup.add(roofCanopy);

    const crownRingGeom = new THREE.TorusGeometry(18.2, 0.18, 8, 72);
    crownRingGeom.scale(1.16, 0.92, 1);
    crownRingGeom.rotateX(Math.PI / 2);
    const crownRingMat = new THREE.MeshBasicMaterial({ color: 0x00ff87 });
    const crownRing = new THREE.Mesh(crownRingGeom, crownRingMat);
    crownRing.position.y = 4.02;
    stadiumGroup.add(crownRing);

    const innerRoofRimGeom = new THREE.TorusGeometry(13.8, 0.1, 8, 72);
    innerRoofRimGeom.scale(1.16, 0.92, 1);
    innerRoofRimGeom.rotateX(Math.PI / 2);
    const innerRoofRimMat = new THREE.MeshBasicMaterial({ color: 0xa7f3d0 });
    const innerRoofRim = new THREE.Mesh(innerRoofRimGeom, innerRoofRimMat);
    innerRoofRim.position.y = 3.98;
    stadiumGroup.add(innerRoofRim);

    for (let c = 0; c < 24; c++) {
      const angle = (c / 24) * Math.PI * 2;
      const cx = Math.cos(angle) * 17.6 * 1.16;
      const cz = Math.sin(angle) * 17.6 * 0.92;
      const colGeom = new THREE.CylinderGeometry(0.16, 0.22, 4.4, 8);
      const colMat = new THREE.MeshLambertMaterial({ color: 0x1f2630 });
      const col = new THREE.Mesh(colGeom, colMat);
      col.position.set(cx, 2.0, cz);
      stadiumGroup.add(col);
    }

    // 4. FLOODLIGHT TOWERS
    const towerAngles = [Math.PI * 0.23, Math.PI * 0.77, Math.PI * 1.23, Math.PI * 1.77];
    towerAngles.forEach((ang) => {
      const dist = 16.5;
      const x = Math.cos(ang) * dist * 1.16;
      const z = Math.sin(ang) * dist * 0.92;

      const mastGeom = new THREE.CylinderGeometry(0.16, 0.35, 8.2, 8);
      const mastMat = new THREE.MeshLambertMaterial({ color: 0x374151 });
      const mast = new THREE.Mesh(mastGeom, mastMat);
      mast.position.set(x, 5.2, z);
      stadiumGroup.add(mast);

      for (let b = 0; b < 4; b++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), mastMat);
        bar.position.set(x, 2.5 + b * 1.5, z);
        stadiumGroup.add(bar);
      }

      const bankGeom = new THREE.BoxGeometry(2.4, 1.2, 0.45);
      const bankMat = new THREE.MeshBasicMaterial({ color: 0xecfdf5 });
      const bank = new THREE.Mesh(bankGeom, bankMat);
      bank.position.set(x * 0.92, 9.3, z * 0.92);
      bank.lookAt(0, 0.6, 0);
      stadiumGroup.add(bank);

      const spot = new THREE.SpotLight(0x6ee7b7, 5.5, 55, Math.PI / 4.2, 0.45, 1.1);
      spot.position.set(x * 0.92, 9.4, z * 0.92);
      spot.target = fieldMesh;
      spots.push(spot);
      stadiumGroup.add(spot);

      const coneGeom = new THREE.ConeGeometry(4.6, 11.5, 20, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false });
      cones.push(coneMat);
      const cone = new THREE.Mesh(coneGeom, coneMat);
      cone.position.set(x * 0.62, 5.2, z * 0.62);
      cone.lookAt(0, 0.3, 0);
      cone.rotateX(Math.PI / 2);
      stadiumGroup.add(cone);
    });

    [-1, 1].forEach((dir) => {
      const sbX = 0;
      const sbZ = dir * 15.6 * 0.92;
      const sbGeom = new THREE.BoxGeometry(4.2, 1.6, 0.3);
      const sbMat = new THREE.MeshBasicMaterial({ color: 0x022c22 });
      const sbMesh = new THREE.Mesh(sbGeom, sbMat);
      sbMesh.position.set(sbX, 4.4, sbZ);
      sbMesh.lookAt(0, 4.4, 0);
      stadiumGroup.add(sbMesh);

      const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 1.4), new THREE.MeshBasicMaterial({ color: 0x059669 }));
      screenFace.position.set(sbX, 4.4, sbZ - dir * 0.18);
      screenFace.lookAt(0, 4.4, 0);
      stadiumGroup.add(screenFace);
    });

    const vignetteGeom = new THREE.RingGeometry(15.5, 30, 80);
    vignetteGeom.rotateX(-Math.PI / 2);
    const vignetteMat = new THREE.MeshBasicMaterial({ color: 0x06080b, transparent: true, opacity: 0.98 });
    const vignette = new THREE.Mesh(vignetteGeom, vignetteMat);
    vignette.position.y = -0.06;
    stadiumGroup.add(vignette);

    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let currentIntensity = 1.0;
    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      
      const targetIntensity = floodlightStore.get() ? 1.0 : 0.0;
      currentIntensity += (targetIntensity - currentIntensity) * delta * 3.0; // smooth transition

      ambientLight.intensity = 0.2 + currentIntensity * (baseLightIntensities.ambient - 0.2);
      hemiLight.intensity = 0.1 + currentIntensity * (baseLightIntensities.hemi - 0.1);
      directionalSun.intensity = 0.1 + currentIntensity * (baseLightIntensities.sun - 0.1);
      
      spots.forEach(spot => spot.intensity = currentIntensity * baseLightIntensities.spot);
      cones.forEach(cone => cone.opacity = currentIntensity * baseLightIntensities.cone);
      neons.forEach(neon => neon.opacity = 0.2 + currentIntensity * (baseLightIntensities.neon - 0.2));

      stadiumGroup.rotation.y += delta * 0.15;


      camera.position.x += (mouseX * 3.5 - camera.position.x) * 0.035;
      camera.position.y += (17.5 + mouseY * 2.2 - camera.position.y) * 0.035;
      camera.lookAt(0, -1.0, 0);

      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 w-full h-full bg-transparent" />
  );
}
