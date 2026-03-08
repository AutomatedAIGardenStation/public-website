"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

function createBox(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
  parent: THREE.Group
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

export default function Station3DViewer({
  className = "",
  showControls = true,
}: {
  className?: string;
  showControls?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRootRef = useRef<THREE.Group | null>(null);
  const xCarriageRef = useRef<THREE.Group | null>(null);
  const yCarriageRef = useRef<THREE.Group | null>(null);
  const zCarriageRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number>(0);
  const isDownRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const [zPos, setZPos] = useState(1.2);
  const [pumpActive, setPumpActive] = useState(true);
  const [statusText, setStatusText] = useState(
    "Central tee at 1.6m. Silicone tube runs between columns."
  );

  const updateMechanicalPositions = useCallback(() => {
    if (
      !xCarriageRef.current ||
      !yCarriageRef.current ||
      !zCarriageRef.current
    )
      return;
    xCarriageRef.current.position.x = xPos;
    yCarriageRef.current.position.z = 0.3 + yPos;
    zCarriageRef.current.position.y = zPos - 1.9;
  }, [xPos, yPos, zPos]);

  useEffect(() => {
    updateMechanicalPositions();
  }, [updateMechanicalPositions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    const sceneRoot = new THREE.Group();
    scene.add(sceneRoot);
    sceneRootRef.current = sceneRoot;

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2.5, 2.5, 3.5);
    camera.lookAt(0, 1.0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sun = new THREE.DirectionalLight(0xffffff, 0.7);
    sun.position.set(5, 10, 5);
    scene.add(sun);

    const grid = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    scene.add(grid);

    const tankMat = new THREE.MeshStandardMaterial({
      color: 0x1e40af,
      transparent: true,
      opacity: 0.5,
    });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const teeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x334155 });

    createBox(1.4, 0.4, 0.6, 0, 0.2, 0, tankMat, sceneRoot);
    createBox(1.42, 0.02, 0.62, 0, 0.41, 0, lidMat, sceneRoot);

    const pumpX = 0,
      pumpY = 0.1,
      pumpZ = 0.1;
    createBox(
      0.1,
      0.12,
      0.1,
      pumpX,
      pumpY,
      pumpZ,
      new THREE.MeshStandardMaterial({ color: 0x111827 }),
      sceneRoot
    );

    const teeHeight = 1.6;
    const centralTee = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.1, 12),
      teeMat
    );
    centralTee.position.set(0, teeHeight, -0.3);
    centralTee.rotation.z = Math.PI / 2;
    sceneRoot.add(centralTee);

    const mainPoints = [
      new THREE.Vector3(pumpX, pumpY + 0.06, pumpZ),
      new THREE.Vector3(pumpX, teeHeight + 0.1, pumpZ),
      new THREE.Vector3(pumpX, teeHeight + 0.1, -0.3),
      new THREE.Vector3(0, teeHeight, -0.3),
    ];
    const mainCurve = new THREE.CatmullRomCurve3(mainPoints);
    const mainTubeGeo = new THREE.TubeGeometry(mainCurve, 40, 0.007, 8, false);
    const mainTube = new THREE.Mesh(
      mainTubeGeo,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
      })
    );
    sceneRoot.add(mainTube);

    [-0.3, 0.3].forEach((posX) => {
      createBox(0.05, 1.2, 0.05, posX, 1.0, -0.3, pipeMat, sceneRoot);
      createBox(0.06, 0.04, 0.06, posX, teeHeight, -0.3, lidMat, sceneRoot);
      const branchPoints = [
        new THREE.Vector3(0, teeHeight, -0.3),
        new THREE.Vector3(posX, teeHeight, -0.3),
      ];
      const branchCurve = new THREE.CatmullRomCurve3(branchPoints);
      const branchTubeGeo = new THREE.TubeGeometry(
        branchCurve,
        10,
        0.005,
        8,
        false
      );
      const branchTube = new THREE.Mesh(
        branchTubeGeo,
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7,
        })
      );
      sceneRoot.add(branchTube);
      for (let i = 0; i < 4; i++) {
        const py = 0.5 + i * 0.3;
        const tee = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, 0.1, 12),
          teeMat
        );
        tee.position.set(posX, py, -0.26);
        tee.rotation.x = -Math.PI / 4;
        sceneRoot.add(tee);
        const p = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x22c55e })
        );
        p.position.set(posX, py + 0.04, -0.24);
        sceneRoot.add(p);
      }
    });

    [-0.3, 0.3].forEach((posX) => {
      createBox(
        0.1,
        1.4,
        0.02,
        posX,
        1.1,
        0.8,
        new THREE.MeshStandardMaterial({ color: 0x1e293b }),
        sceneRoot
      );
      createBox(
        0.08,
        1.3,
        0.005,
        posX,
        1.1,
        0.79,
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
        sceneRoot
      );
    });

    const railMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.2,
    });
    createBox(1.6, 0.04, 0.04, 0, 1.9, 0.1, railMat, sceneRoot);
    createBox(1.6, 0.04, 0.04, 0, 1.9, 0.5, railMat, sceneRoot);

    const carriageMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const activeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });

    const xCarriage = new THREE.Group();
    xCarriage.position.y = 1.9;
    sceneRoot.add(xCarriage);
    xCarriageRef.current = xCarriage;
    createBox(0.2, 0.04, 0.5, 0, 0.04, 0.3, carriageMat, xCarriage);
    createBox(0.15, 0.06, 0.06, 0, 0, 0.1, carriageMat, xCarriage);
    createBox(0.15, 0.06, 0.06, 0, 0, 0.5, carriageMat, xCarriage);

    const yCarriage = new THREE.Group();
    yCarriage.position.z = 0.3;
    xCarriage.add(yCarriage);
    yCarriageRef.current = yCarriage;
    createBox(0.14, 0.06, 0.14, 0, 0.08, 0, carriageMat, yCarriage);
    createBox(0.04, 1.8, 0.04, 0, -0.9, 0, railMat, yCarriage);

    const zCarriage = new THREE.Group();
    yCarriage.add(zCarriage);
    zCarriageRef.current = zCarriage;
    createBox(0.16, 0.1, 0.16, 0, 0, 0, activeMat, zCarriage);
    createBox(0.04, 0.04, 0.55, 0, 0, -0.25, activeMat, zCarriage);
    createBox(0.08, 0.08, 0.1, 0, 0, -0.5, carriageMat, zCarriage);

    xCarriage.position.x = 0;
    yCarriage.position.z = 0.3;
    zCarriage.position.y = 1.2 - 1.9;

    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    const onMouseDown = (e: MouseEvent) => {
      isDownRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDownRef.current = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current || !sceneRoot) return;
      const dx = (e.clientX - prevMouseRef.current.x) * 0.01;
      const dy = (e.clientY - prevMouseRef.current.y) * 0.01;
      sceneRoot.rotation.y += dx;
      sceneRoot.rotation.x = Math.max(
        -0.5,
        Math.min(0.5, sceneRoot.rotation.x + dy)
      );
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      ro.disconnect();
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frameRef.current);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      sceneRootRef.current = null;
      xCarriageRef.current = null;
      yCarriageRef.current = null;
      zCarriageRef.current = null;
    };
  }, []);

  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !sceneRootRef.current) return;
    cameraRef.current.position.set(2.5, 2.5, 3.5);
    cameraRef.current.lookAt(0, 1.0, 0);
    sceneRootRef.current.rotation.set(0, 0, 0);
  }, []);

  const togglePump = useCallback(() => {
    setPumpActive((p) => {
      const next = !p;
      setStatusText(
        next
          ? "Pump delivers solution to the central tee."
          : "Pump stopped."
      );
      return next;
    });
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[320px] ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/90 backdrop-blur border-t border-slate-700/50 flex flex-col gap-3 max-h-[45%] overflow-y-auto">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-green-400 italic">
              GARDEN STATION
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">
              Engineering Model v6.4 · Central Hydraulic
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="flex justify-between text-[10px] text-slate-400 mb-0.5 font-mono">
                X <span className="text-green-400 font-bold">{xPos.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={-0.6}
                max={0.6}
                step={0.01}
                value={xPos}
                onChange={(e) => setXPos(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-green-500"
              />
            </div>
            <div>
              <label className="flex justify-between text-[10px] text-slate-400 mb-0.5 font-mono">
                Y <span className="text-blue-400 font-bold">{yPos.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={-0.15}
                max={0.15}
                step={0.01}
                value={yPos}
                onChange={(e) => setYPos(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div>
              <label className="flex justify-between text-[10px] text-slate-400 mb-0.5 font-mono">
                Z <span className="text-red-400 font-bold">{zPos.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={0.4}
                max={1.6}
                step={0.01}
                value={zPos}
                onChange={(e) => setZPos(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800 min-h-[36px]">
            {statusText}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetCamera}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold border border-slate-700 text-slate-300 transition-colors"
            >
              Reset camera
            </button>
            <button
              type="button"
              onClick={togglePump}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold border border-slate-700 text-slate-300 transition-colors"
            >
              Pump: {pumpActive ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}
      <p className="absolute top-2 left-2 text-[10px] text-slate-400 pointer-events-none">
        Drag to rotate
      </p>
    </div>
  );
}
