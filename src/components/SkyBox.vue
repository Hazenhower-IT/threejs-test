<template>
    <canvas ref="canvasRef"></canvas>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from "vue"
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
  import * as THREE from "three"
  
  let scene = new THREE.Scene()
  let renderer

  let materialArray = []
  
  let canvasRef = ref()
  
  
  
  let camera = new THREE.PerspectiveCamera(
    55, //vertical field of view
    window.innerWidth / window.innerHeight, //aspect ratio
    45, //near plane
    30000 //far plane
  );
  camera.position.set(-900, -200, -900)


  let ambientLight = new THREE.AmbientLight(0x555555)
  scene.add(ambientLight);

  // Moonlight
  let directionalLight = new THREE.DirectionalLight(0xffeedd)
  directionalLight.position.set(0, 0, 1)
  scene.add(directionalLight )

  
  
  
  let loop = () => {
    renderer.render(scene, camera)
  };
  
  let resizeCallback = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  };
  
  onMounted(() => {
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
    renderer.setAnimationLoop(loop)

    let controls = new OrbitControls(camera, canvasRef.value)
    controls.minDistance = 500
    controls.maxDistance = 1500

    let materialArray = []
    
    let texture_negx = new THREE.TextureLoader().load("/skybox/negx.jpg")
    let texture_negy = new THREE.TextureLoader().load("/skybox/negy.jpg")
    let texture_negz = new THREE.TextureLoader().load("/skybox/negz.jpg")
    let texture_posx = new THREE.TextureLoader().load("/skybox/posx.jpg")
    let texture_posy = new THREE.TextureLoader().load("/skybox/posy.jpg")
    let texture_posz = new THREE.TextureLoader().load("/skybox/posz.jpg")

    materialArray.push(new THREE.MeshBasicMaterial({map:texture_posx}))
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_negx}))
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_posy}))
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_negy}))
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_posz}))
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_negz}))

    for(let i=0; i<6; i++){
      materialArray[i].side = THREE.BackSide
    }

    let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000)
    let skybox = new THREE.Mesh(skyboxGeo, materialArray)
    scene.add(skybox)
  
    window.addEventListener("resize", resizeCallback)
  })
  
  onUnmounted(() => {
    renderer.setAnimationLoop(null)
  })
  </script>
  
  <style>
    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  </style>