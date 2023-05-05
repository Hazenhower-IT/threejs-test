<template>
    <canvas ref="canvasRef"></canvas>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from "vue"
  import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls"
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
  import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
  import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
  import * as THREE from "three"
  
  let scene = new THREE.Scene()
  let renderer
  let controls
  
  let canvasRef = ref();
  
  const textureLoader = new THREE.TextureLoader()
  
  let box2
  
  var person
  var clock = new THREE.Clock()
  
  
  
  // Text
  const fontLoader = new FontLoader();
  const textMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff});
  fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry("Hazenhower", {
        font: font,
        size: 15,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 3,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-2, 0, -2);
      textMesh.rotation.y +=0 
      scene.add(textMesh);
    }
  );
  
  // Tecnologies
  fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const tecnologiesGeometry = new TextGeometry("Tecnologies", {
        font: font,
        size: 15,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 3,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      const tecnologiesMesh = new THREE.Mesh(tecnologiesGeometry, textMaterial);
      tecnologiesMesh.position.set(-2, 10, 75);
      tecnologiesMesh.rotation.y +=0 
      scene.add(tecnologiesMesh);
    }
  );
  
  // Plane
  let sampietrino = textureLoader.load("/texture/sampietrino3.jpg")
  sampietrino.wrapS = THREE.RepeatWrapping
  sampietrino.wrapT = THREE.RepeatWrapping
  sampietrino.repeat.set(15,15)
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1000,1000),
    new THREE.MeshPhongMaterial({map:sampietrino , side: THREE.DoubleSide})
  )
  plane.rotation.x = -0.5 * Math.PI
  plane.receiveShadow = true;
  scene.add(plane)
  
  
  
  
  
  
  let ambientLight = new THREE.DirectionalLight("#ffffff", 1);
  ambientLight.position.set(-1, 2, 4);
  scene.add(ambientLight);
  
  let camera = new THREE.PerspectiveCamera(
    75, //vertical field of view
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1, //near plane
    3000 //far plane
  );
  camera.position.y = 10;
  camera.position.z = 500;
  camera.position.x = 0;
  scene.add(camera);
  
  
  
  let loop = () => {
    box2.rotation.y += 0.02
    box2.rotation.x += 0.01
  
    //controls.update();
    person.update(clock.getDelta())
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
  
    
  
    
    //scene.background = textureLoader.load("/space.jpg") // make a 2d scene
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    scene.background = cubeTextureLoader.load([
      "/skybox/px.jpg",
      "/skybox/nx.jpg",
      "/skybox/py.jpg",
      "/skybox/ny.jpg",
      "/skybox/pz.jpg",
      "/skybox/nz.jpg",
    ])
  
    // Ad a second, larger, multimaterial Box
  const box2MultiMaterial = [
      new THREE.MeshBasicMaterial({map: textureLoader.load("/tecnologies/threejs2.png")}),
      new THREE.MeshBasicMaterial({map: textureLoader.load("/tecnologies/vue.png")}),
      new THREE.MeshBasicMaterial({map: textureLoader.load("/tecnologies/JavaScript.png")}),
      new THREE.MeshBasicMaterial({map: textureLoader.load("/tecnologies/Python.png")}),
      new THREE.MeshBasicMaterial({map: textureLoader.load("/tecnologies/firebase.jpg")}),
      new THREE.MeshBasicMaterial({map: textureLoader.load("/tecnologies/github.png")}),
    ]
    box2 = new THREE.Mesh(
      new THREE.BoxGeometry(6,6,6),
      box2MultiMaterial
    )
    box2.position.set(0, 6, 50)
    scene.add(box2)
  
    //controls = new OrbitControls(camera, canvasRef.value);
    //controls.enableDamping = true;
    person = new FirstPersonControls(camera, renderer.domElement)
    person.movementSpeed = 50
    person.lookVertical = false
    person.lookSpeed = 0.2
    
  
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