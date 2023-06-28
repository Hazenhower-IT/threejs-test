<template>
  <!-- Menu Hideble-->
  <div id="menu">

    <div id="img_container">
      <img src="/logo-hazen.png" style="height: 100%; width: 500px; " alt="modern musa logo" />
    </div>

    <div class="content_container">
      <div id="content">

        <div class="title">
          <h1 class="stroke">Alessio Aquilanti <br> Digital Curriculum</h1>
          <h1 class="main">Alessio Aquilanti <br> Digital Curriculum</h1>
        </div>
      
        <div>
          <p>Designed and made by Alessio Aquilanti alias Hazenhower </p>
        </div>

        <div>
          <p class="instructions">Instructions:</p>
          <p>Arrow Keys Or W/A/S/D To Move Around</p>
          <p>Shift to Run</p>
          <p>Space for Jump</p>
          <p>Mouse To Look Around</p>
          <p>Esc To Pause</p>
        </div>
    
        <div id="play_button">
          <p>Enter The Gallery</p>
        </div>

      </div>
    </div>
    
  </div>
  <!---->


    <canvas ref="canvasRef"></canvas>

    <div class="progress-bar-container">
      <label for="progress-bar">Loading...</label>
      <progress id="progress-bar" value="0" max="100"></progress>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from "vue"
  import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls"
  import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
  import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
  import * as THREE from "three"
  import * as dat from "dat.gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
  
  const gui = new dat.GUI()

  let scene = new THREE.Scene()
  let renderer
  
  let canvasRef = ref();
  
  const textureLoader = new THREE.TextureLoader()
  
  let box2
  
  let controls
  //let orbitControls
  const clock = new THREE.Clock()
  
  let loadedModel

  //Buildings
  let house1
  //Shops
  let musicStore
  let gameStore
  let arcadeCity
  let deployosHermanos
  let manciniPizza
  let depositoBagagli

  //player variables
  let moveSpeed
  let run = false
  
  
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
  
  
  
  
  
  
  let ambientLight = new THREE.AmbientLight("#ffffff", 1);
  ambientLight.position.set(-1, 2, 4);
  scene.add(ambientLight);
  
  let camera = new THREE.PerspectiveCamera(
    75, //vertical field of view
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1, //near plane
    3000 //far plane
  );
  camera.position.y = 20;
  camera.position.z = 500;
  camera.position.x = 0;
  scene.add(camera);


// Controller

// Tasti
const keyPressed = {};

// Mappa dei tasti
const keyMap = {
  38: "ArrowUp",
  40: "ArrowDown",
  37: "ArrowLeft",
  39: "ArrowRight",
  87: "w",
  65: "a",
  83: "s",
  68: "d",
  16: "shift"
};


// Event listener WASD controls
document.addEventListener(
  "keydown",
  (e) => {
    const keyCode = e.keyCode;
    const key = keyMap[keyCode];
    if (key) {
      keyPressed[key] = true;

      if(key ==="shift"){
        run = true
      }
    }
  },
  false
);

document.addEventListener(
  "keyup",
  (e) => {
    const keyCode = e.keyCode;
    const key = keyMap[keyCode];
    if (key) {
      keyPressed[key] = false;
      if(key==="shift"){
        run = false
      }
    }
  },
  false
);


// Update movement function
function updateMovement(delta) {
  
  const previousPosition = camera.position.clone();
  if(keyPressed.shift){
    moveSpeed = 100 * delta;
  }
  else{
    moveSpeed = 50 * delta;
  }

  if (keyPressed.ArrowRight || keyPressed.d) {
    controls.moveRight(moveSpeed);
  } else if (keyPressed.ArrowLeft || keyPressed.a) {
    controls.moveRight(-moveSpeed);
  } else if (keyPressed.ArrowUp || keyPressed.w) {
    controls.moveForward(moveSpeed);
  } else if (keyPressed.ArrowDown || keyPressed.s) {
    controls.moveForward(-moveSpeed);
  }

  // Aggiungi altre azioni se necessario

}

  
let loop = () => {
  const delta = clock.getDelta()

  //Riattiva dopo posizionamento Palazzi
  updateMovement(delta)
 //orbitControls.update()

  let cameraPos = camera.position

  box2.rotation.y += 0.02
  box2.rotation.x += 0.01
  
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
  
    //RIATTIVA DOPO POSIZIONAMENTO PALAZZI
    controls = new PointerLockControls(camera, document.body)

    //orbitControls = new OrbitControls(camera, canvasRef.value)


    //Lock the pointer( activate controls ) and start the experience hiding the menu
    function startExperience(){
      //lock the pointer
     
      //RIATTIVA DOPO POSIZIONAMENTO PALAZZI
       controls.lock()
      
      
      //hide the menu
      hideMenu()
      
    }


    //event listener to the enter gallery button
    let playButton = document.getElementById("play_button")
    playButton.addEventListener("click", startExperience)


    //Hide Menu Function
    function hideMenu(){
      let menu = document.getElementById("menu")
      menu.style.display="none" //hide the menu
      
    }

    //Show Menu Function
    function showMenu(){
      let menu = document.getElementById("menu")
      menu.style.display="block"
      
    }

    //RIATTIVA DOPO POSIZIONAMENTO PALAZZI
    controls.addEventListener("unlock", showMenu)


    //UPLOADING 3D ELEMENTS

    const loadingManager = new THREE.LoadingManager()

    const progressBar = document.getElementById("progress-bar")

    loadingManager.onProgress = (url,loaded,total) => {
      progressBar.value = (loaded/total) * 100
    }

    const progressBarContainer = document.querySelector(".progress-bar-container")

    loadingManager.onLoad = () =>{
      progressBarContainer.style.display = "none"
    }

    //HOUSE 1 MODEL (? Decidere se lasciarlo per qualcosa, lasciarlo comunque o cambiare il tipo di modello)
    const gltfLoader = new GLTFLoader(loadingManager)
    gltfLoader.load('/models/house/scene.gltf', (model) =>{
      loadedModel = model.scene.children[0]
      house1 = loadedModel.clone()
      house1.name = "house1"
      house1.scale.set(0.35,0.35,0.35)
      house1.position.set(345, 0, 355)
      house1.rotation.z = Math.PI
      scene.add(house1)

      // GUI
      /*
      gui.add(house1.position, "x").min(-1000).max(1000).step(0.001).name("HousePosX")
      gui.add(house1.position, "y").min(-10).max(10).step(0.001).name("HousePosY")
      gui.add(house1.position, "z").min(-1000).max(1000).step(0.001).name("HousePosZ")

      gui.add(house1.scale, "x").min(0).max(50).step(0.001).name("scaleX")
      gui.add(house1.scale, "y").min(0).max(50).step(0.0001).name("scaleY")
      gui.add(house1.scale, "z").min(0).max(50).step(0.001).name("scalez")

      gui.add(house1.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation X");
      gui.add(house1.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Y");
      gui.add(house1.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Z");
      */
    })
    

    // FEDERICI GUITARIST
    gltfLoader.load('/models/music-store/scene.gltf', (model) =>{
      loadedModel = model.scene.children[0]
      musicStore = loadedModel.clone()
      musicStore.name = "musicStore"
      musicStore.scale.set(20,20,20)
      musicStore.position.set(-314, 0, 517.39)
      musicStore.rotation.z += Math.PI /2

      scene.add(musicStore)

      // GUI
       /*
      gui.add(musicStore.position, "x").min(-1000).max(1000).step(0.001).name("musicStorePosX")
      gui.add(musicStore.position, "y").min(-10).max(10).step(0.001).name("musicStorePosY")
      gui.add(musicStore.position, "z").min(-1000).max(1000).step(0.001).name("musicStorePosZ")
      */
    })

    // MODERN MUSA
    gltfLoader.load('/models/small-game-store/scene.gltf', (model) =>{
      loadedModel = model.scene.children[0]
      gameStore = loadedModel.clone()
      gameStore.name = "gameStore"
      gameStore.scale.set(.6,.6,.6)
      gameStore.position.set(-455 , 0, 171.4)
      gameStore.rotation.z +=  -Math.PI / 2
      
      scene.add(gameStore)

      // GUI
      /*
      gui.add(gameStore.position, "x").min(-1000).max(1000).step(0.001).name("gameStorePosX")
      gui.add(gameStore.position, "y").min(-10).max(10).step(0.001).name("gameStorePosY")
      gui.add(gameStore.position, "z").min(-1000).max(1000).step(0.001).name("gameStorePosZ")
      */
    })


    //Tendone Unity
    gltfLoader.load('/models/arcade-city/scene.gltf', (model) =>{
      loadedModel = model.scene.children[0]
      arcadeCity = loadedModel.clone()
      arcadeCity.name = "arcadeCity"
      arcadeCity.scale.set(1.5,1.5,1.5)
      arcadeCity.position.set(350, 27, 171.4)
      arcadeCity.rotation.z += -Math.PI /2
      
      scene.add(arcadeCity)

      // GUI
      /*  
      gui.add(arcadeCity.position, "x").min(-1000).max(1000).step(0.001).name("arcadeCityPosX")
      gui.add(arcadeCity.position, "y").min(-10).max(10).step(0.001).name("arcadeCityPosY")
      gui.add(arcadeCity.position, "z").min(-1000).max(1000).step(0.001).name("arcadeCityPosZ")
      */
    })


    // SSD - Deployos Hermanos
    gltfLoader.load('/models/deployos-hermanos/scene.gltf', (model) =>{
      loadedModel = model.scene.children[0]
      deployosHermanos = loadedModel.clone()
      deployosHermanos.name = "deployosHermanos"
      deployosHermanos.scale.set(15,15,15)
      deployosHermanos.position.set(-217.8 ,0.01, -1.64)
      deployosHermanos.rotation.z += -Math.PI / 2   
      scene.add(deployosHermanos)

      // GUI
      /*
      gui.add(deployosHermanos.position, "x").min(-1000).max(1000).step(0.001).name("deployosHermanosPosX")
      gui.add(deployosHermanos.position, "y").min(-10).max(10).step(0.001).name("deployosHermanosPosY")
      gui.add(deployosHermanos.position, "z").min(-1000).max(1000).step(0.001).name("deployosHermanosPosZ")
      */
    })

    // Pizzeria - mancini-pizza-beer
    gltfLoader.load('/models/mancini-pizza-beer/scene.gltf', (model) =>{
      loadedModel = model.scene.children[0]
      manciniPizza = loadedModel.clone()
      manciniPizza.name = "manciniPizza"
      manciniPizza.scale.set(25,20,35)
      manciniPizza.position.set(344.4 ,0.01, 1.623)
      manciniPizza.rotation.z += -Math.PI / 2   
      scene.add(manciniPizza)

      // GUI
       
      gui.add(manciniPizza.position, "x").min(-1000).max(1000).step(0.001).name("manciniPizzaPosX")
      gui.add(manciniPizza.position, "y").min(-10).max(10).step(0.001).name("manciniPizzaPosY")
      gui.add(manciniPizza.position, "z").min(-1000).max(1000).step(0.001).name("manciniPizzaPosZ")

      gui.add(manciniPizza.scale, "x").min(0).max(50).step(0.001).name("scaleX")
      gui.add(manciniPizza.scale, "y").min(0).max(50).step(0.0001).name("scaleY")
      gui.add(manciniPizza.scale, "z").min(0).max(50).step(0.001).name("scalez")

      gui.add(manciniPizza.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation X");
      gui.add(manciniPizza.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Y");
      gui.add(manciniPizza.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Z");
    })

    // Deposito Bagagli - buster-brown-shoe-store(?)
    gltfLoader.load('/models/buster-brown-shoe-store/scene.gltf', (model) =>{
      loadedModel = model.scene.children[0]
      depositoBagagli = loadedModel.clone()
      depositoBagagli.name = "depositoBagagli"
      depositoBagagli.scale.set(10.9, 7.7, 24.419)
      depositoBagagli.position.set(171.4 , 2.36, -230)
      depositoBagagli.rotation.z += -Math.PI   
      scene.add(depositoBagagli)

      // GUI
      /*
      gui.add(depositoBagagli.position, "x").min(-1000).max(1000).step(0.001).name("BagagliposX")
      gui.add(depositoBagagli.position, "y").min(-10).max(10).step(0.001).name("BagagliposY")
      gui.add(depositoBagagli.position, "z").min(-1000).max(1000).step(0.001).name("BagagliposZ")

      
      gui.add(depositoBagagli.scale, "x").min(0).max(50).step(0.001).name("scaleX")
      gui.add(depositoBagagli.scale, "y").min(0).max(50).step(0.0001).name("scaleY")
      gui.add(depositoBagagli.scale, "z").min(0).max(50).step(0.001).name("scalez")

      gui.add(depositoBagagli.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation X");
      gui.add(depositoBagagli.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Y");
      gui.add(depositoBagagli.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Z");
      */
     
    })

  
    window.addEventListener("resize", resizeCallback);
  });
  
  onUnmounted(() => {
    renderer.setAnimationLoop(null);
  });
  </script>
  
<style scoped>

html,
body {
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: #28282f;
  margin: 0em;
}
  
canvas {
    width: 100%;
    height: 100%;
    display: block;
    position:absolute;
    top:0;
    left:0;  
}

body {
  margin: 0em;
  padding: 0em;
  overflow: hidden;
  font-family: 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial,
    'Lucida Grande', sans-serif;
  background-color: #121212;
  cursor: url('http://www.rw-designer.com/cursor-view/97756.png') 16 16, auto;
}

p,
img,
div,
canvas {
  vertical-align: top;
}

::-moz-selection {
  /* Code for Firefox */
  background: #34495e;
  background-color: #34495e;
  color: #fff;
}

::selection {
  /* Code for Chrome, Safari and Opera */
  background: #34495e;
  background-color: #34495e;
  color: #fff;
}

.hide {
  /* Hide elements */
  display: none;
}

#menu {
  width: 48em;
  position: absolute;
  z-index: 1000;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -46%);

  border-radius: 0.9em;

  text-align: center;
  font-size: 1.2em;

  background-color: black;
  opacity: 1;

  box-shadow: none;

  animation: fadeIn 1s ease-in;
}

#menu #content_container {
  background-color: #000;
  padding: 1em;
  border-bottom-left-radius: 0.9em;
  border-bottom-right-radius: 0.9em;

  -webkit-box-shadow: 0em 0.25em 0.75em rgba(124, 124, 124, 0.5);
  -moz-box-shadow: 0em 0.25em 0.75em rgba(124, 124, 124, 0.5);
  box-shadow: 0em 0.25em 0.75em rgba(124, 124, 124, 0.5);
}

#menu #img_container {
  position: relative;
  height: 14.5em;
  overflow: hidden;
  border-top-left-radius: 0.9em;
  border-top-right-radius: 0.9em;
}

#menu #img_container img {
  flex-shrink: 0;
  width: 105%;
}

#menu #content {
  padding: 0.6em;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInSlideUp 3s ease-out forwards;
}

@keyframes fadeInSlideUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

#menu #content div {
  margin-bottom: 0.1em;
}

#menu h1 {
  font-family: 'Oswald';
  letter-spacing: 0.25em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

#menu #content p {
  font-family: 'Lato', sans-serif;
  font-size: 1.1em;
  font-weight: 500;
  line-height: 1em;
  color: #fff;
  margin: 0.2em 0;
}

#menu #content p.instructions {
  font-size: 1.3em;
  font-weight: 600;
  margin-bottom: 0.3em;
}

#menu #play_button {
  display: inline-block;
  background-color: #34495e;
  color: #fff;
  border-radius: 0.9em;
  padding: 0.5em 1.5em;
  font-weight: 600;
  margin-top: 0.5em;
  margin-bottom: 0.75em;
  transition: all 0.4s;
}

#menu #play_button:hover {
  background-color: #2323be;
  color: #fff;
  transform: scale(1.05);
  cursor: pointer;
  transition: all 0.4s;
}

#menu #play_button p {
  font-family: 'Oswald';
  letter-spacing: 0.125em;
  color: white;
  font-size: 1.3em;
  transition: all 0.4s;
}

#menu #play_button:hover p {
  color: #2323be;
  transition: all 0.4s;
  color: white;
}

#background_menu {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: #111;
  opacity: 0.125;
}

canvas {
  width: 100%;
  height: 100%;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.title {
  position: relative;
  display: inline-block;
  margin-bottom: 0.5em;
}

.title .stroke {
  color: transparent;
  -webkit-text-stroke: 2px #2323be;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  animation: fadeIn 2s ease-in;
}

.title .main {
  position: relative;
  z-index: 2;
  color: #fff;
  text-shadow: 2px 2px 0px #2323be, 4px 4px 0px rgba(0, 0, 0, 0.4);
  animation: fadeIn 2s ease-in;
}

#starry_night_bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://th.bing.com/th/id/R.cf8cb0d1a972300c5e60b3ebf20b5779?rik=QLOj5Ukvu%2brJNQ&pid=ImgRaw&r=0');
  background-size: cover;
  background-position: center;
  z-index: -1;
  animation: panBg 30s linear infinite;
  background-attachment: fixed;
}

@keyframes panBg {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

#painting-info {
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
  color: #fff;
  width: 300px;
  height: auto;
  z-index: 990;
  transition: all 0.3s ease-in-out;
  transform: translate(500px, 100px);
  opacity: 0;
}

#painting-info.show {
  transform: translate(500px, 150px);
  opacity: 1;
  z-index:990;
}

#painting-info h3 {
  margin: 0 0 10px 0;
  font-size: 2em;
  font-weight: bold;
  text-transform: uppercase;
}

#painting-info p {
  margin: 0;
  font-size: 1.2em;
}

.progress-bar-container{
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#progress-bar{
  width: 30%;
  margin-top: 0.5%;
  height: 2%;
}

label{
  color:white;
  font-size: 2rem;
}
  </style>