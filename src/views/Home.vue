<template>
    <canvas ref="canvasRef"></canvas>
</template>
  
<script setup>
  import { ref, onMounted, onUnmounted } from "vue"
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
  import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
  import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
  import * as THREE from "three"
  
  let scene = new THREE.Scene()
  let renderer
  let controls

  let canvasRef = ref();
  
  
  // Text
  const fontLoader = new FontLoader();
  const textMaterial = new THREE.MeshPhongMaterial({ color: "white" });
  fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry("Hazenhower - Alessio Aquilanti", {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-4, 2, -2);
      scene.add(textMesh);
    }
  );
  
  let ambientLight = new THREE.DirectionalLight("#ffffff", 1);
  ambientLight.position.set(-1, 2, 4);
  scene.add(ambientLight);
  
  let camera = new THREE.PerspectiveCamera(
    75, //vertical field of view
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1, //near plane
    100 //far plane
  );
  camera.position.y = 0;
  camera.position.z = 3;
  camera.position.x=0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);
  
  let loop = () => {
    controls.update();
    renderer.render(scene, camera);
  };
  
  let resizeCallback = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  
  onMounted(() => {
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true,
    });
  
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(scene, camera);
  
    renderer.setAnimationLoop(loop);
  
    controls = new OrbitControls(camera, canvasRef.value);
    controls.enableDamping = true;
  
    window.addEventListener("resize", resizeCallback);
  });
  
  onUnmounted(() => {
    renderer.setAnimationLoop(null);
  });
  </script>
  
  <style>
    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  </style>