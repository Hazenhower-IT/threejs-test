<template>

    <canvas ref="canvasRef"></canvas>

    <main>
      
      <header>
        <h1>Jeff Delaney</h1>
        <p>🚀 Welcome to my website!</p>
      </header>


      <blockquote>
        <p>I like making stuff and putting it on the internet</p>
      </blockquote>

      <section>
        <h2>📜 Manifesto</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

      </section>

      <section class="light">
        <h2>👩🏽‍🚀 Projects</h2>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <h2>🏆 Accomplishments</h2>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

      </section>

      <blockquote>
        <p>The best way out is always through <br>-Robert Frost</p>
      </blockquote>

      <section class="left">
        <h2>🌮 Work History</h2>

        <h3>McDonalds</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h3>Burger King</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h3>Taco Bell</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

      </section>

      <blockquote>
        <p>Thanks for watching!</p>
      </blockquote>


    </main>

</template>
  
<script setup>
  import { ref, onMounted, onUnmounted } from "vue"
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
  import * as THREE from "three"

  
  let scene = new THREE.Scene()
  let renderer
  let controls

  let canvasRef = ref()

  let earth
  let hazen
  
  
  let camera = new THREE.PerspectiveCamera(
    75, //vertical field of view
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1, //near plane
    1000 //far plane
  )
  camera.position.z = 30

  let geometry = new THREE.TorusGeometry(10, 3, 16, 100)
  let material = new THREE.MeshStandardMaterial( {color: 0xff6347})
  let torus = new THREE.Mesh(geometry,material)
  scene.add(torus)

  let pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(5,5,5)
  
  let ambientLight = new THREE.AmbientLight(0xffffff)
  scene.add(pointLight, ambientLight)

  let lightHelper = new THREE.PointLightHelper(pointLight)
  scene.add(lightHelper)
  
  let gridHelper = new THREE.GridHelper(200,50)
  scene.add(gridHelper)
  
  let loop = () => {
    torus.rotation.x +=0.01
    torus.rotation.y +=0.01
    torus.rotation.z +=0.01

    earth.rotation.y += 0.005

    controls.update();
    renderer.render(scene, camera);
  };

  let addStar = () => {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24)
    const material = new THREE.MeshStandardMaterial({color: 0xffffff})
    const star = new THREE.Mesh(geometry, material)

    const [x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100))
    star.position.set(x,y,z)
    scene.add(star)
  }

  Array(200).fill().forEach(addStar)

  
  let moveCamera = () =>{
    const t = document.body.getBoundingClientRect().top
    earth.rotation.x += 0.05
    earth.rotation.y += 0.075
    earth.rotation.z += 0.05

    hazen.rotation.y += 0.01
    hazen.rotation.z += 0.01

    camera.position.z = t * -0.01
    camera.position.x = t * -0.0002
    camera.position.y = t * 0.0002


  }
  document.body.onscroll = moveCamera
  
  let resizeCallback = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }
  
  onMounted(() => {
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true,
    })
  
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.render(scene, camera)
  
    renderer.setAnimationLoop(loop)

    const spaceTexture = new THREE.TextureLoader().load("/space2.jpg")
    scene.background = spaceTexture

    const hazenTexture = new THREE.TextureLoader().load("/cv2-2.jpg")
    hazen = new THREE.Mesh(
      new THREE.BoxGeometry(3,3,3),
      new THREE.MeshBasicMaterial( {map : hazenTexture})
    )
    scene.add(hazen)

    const earthTexture = new THREE.TextureLoader().load("/earth.jpg")
    const normaltexture = new THREE.TextureLoader().load("/normal.jpg")
    earth = new THREE.Mesh(
      new THREE.SphereGeometry(3,32,32),
      new THREE.MeshStandardMaterial( {map: earthTexture, normalMap: normaltexture})
    )
    scene.add(earth)

    earth.position.z = 20;
    earth.position.x = -10


    controls = new OrbitControls(camera, canvasRef.value)
    controls.enableDamping = true

  
  
    window.addEventListener("resize", resizeCallback)
  })
  
  onUnmounted(() => {
    renderer.setAnimationLoop(null)
  })
  </script>
  
  <style scoped>
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      outline: none;
    }

    
    :root {
  --dark-bg: rgba(15, 15, 15, 0.7);
  --spacing: 350px;

  font-family: brandon-grotesque, sans-serif;
  font-weight: 400;
  font-style: normal;
}


main {
  width: 100vw;
  color: white;
  z-index: 99;
  position: absolute;
  width: 100%;
  margin: 0px auto;
  padding: 120px 0px;
  
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

h1, h2, h3, blockquote {
  font-family: elevon, sans-serif;
  font-weight: 700;
  font-style: normal;
  background-color: rgb(0,0,0,0.5);
  
}

canvas {
  position: fixed;
  top: 0;
  left: 0;
}



  header {
    background: var(--dark-bg);
    grid-column: 2 / span 5;
    font-size: 2.5rem;
    padding: 2rem;
    margin-bottom: var(--spacing);
  }

  section {
    grid-column: 2 / 8;
    padding: 1rem;
    background: var(--dark-bg);
    font-size: 1.25rem;
    line-height: 1.5;
    margin-bottom: var(--spacing);
  }

  blockquote {
    margin: 0;
    padding: 0;
    grid-column: 2 / span 9;
    margin-bottom: var(--spacing);
  }

  blockquote, p {
    color:white;
    background-color: rgb(0,0,0,0.5);
    font-size: 4rem;
    display: inline;
    line-height: 1;
  }

  .left {
    grid-column: 6 / 12;
  }
  </style>