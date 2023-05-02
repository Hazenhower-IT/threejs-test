<template>
    <canvas ref="canvasRef"></canvas>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import * as THREE from "three";
  
  let scene = new THREE.Scene();
  let renderer;
  
  let canvasRef = ref();
  
  let cloudParticles = []
  
  let flash

  let rain, rainGeo, rainCount=15000
  
  let camera = new THREE.PerspectiveCamera(
    60, //vertical field of view
    window.innerWidth / window.innerHeight, //aspect ratio
    1, //near plane
    1000 //far plane
  );
  camera.position.z = 1
  camera.rotation.x = 1.16
  camera.rotation.y = -0.12
  camera.rotation.z = 0.27



  let ambientLight = new THREE.AmbientLight(0x555555)
  scene.add(ambientLight);

  // Moonlight
  let directionalLight = new THREE.DirectionalLight(0xffeedd)
  directionalLight.position.set(0, 0, 1)
  scene.add(directionalLight )

  // Ligthning
  flash = new THREE.PointLight(0x062d89, 30, 500, 1.7)
  flash.position.set(200,300,100)
  scene.add(flash)
  
  
  let loop = () => {
    //animate cloud loop
    cloudParticles.forEach(p=>{
        p.rotation.z -= 0.002
    })

    // lightning-flash lopp
    if(Math.random() > 0.93 || flash.power > 100){
        if(flash.power < 100)
            flash.position.set(
                Math.random()*400,
                300 + Math.random()*200,
                100
            )
            flash.power = 50 + Math.random()*500
    }

    // Raindrop loop
    const position = rainGeo.getAttribute("position")
    for(let i=0; i< position.count; i++){
        position.setY(i, position.getY(i) - 0.5)

        //se la goccia di pioggia è caduta oltre il pavimento, la riposiziona sopra
        if (position.getY(i) < -250){
            position.setY(i, 250)
        }
    }
    position.needsUpdate = true //indica a tree.js di ggiornare la geometria
    rain.rotation.y += 0.002;

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
    });

    scene.fog = new THREE.FogExp2(0x1c1c2a, 0.002)

    renderer.setClearColor(scene.fog.color)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    renderer.setAnimationLoop(loop);

    
    
  

    rainGeo = new THREE.BufferGeometry()
    const rainPosition = new Float32Array(rainCount*3)
    for(let i=0; i<rainCount; i++){  
        rainPosition[i*3] = Math.random() * 400 - 200
        rainPosition[i * 3 + 1] = Math.random() * 500 - 250
        rainPosition[i * 3 + 2] = Math.random() * 400 - 200
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPosition, 3))
    let rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true
    })
    rain = new THREE.Points(rainGeo, rainMaterial)
    scene.add(rain)

    let loader = new THREE.TextureLoader()
    loader.load("/texture/R.png", function(texture){

        let cloudGeo = new THREE.PlaneGeometry(500,500)
        let cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        })

        for(let p=0; p<20; p++){
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial)
            cloud.position.set(
                Math.random()*800 - 400,
                500,
                Math.random()*500 - 450
            )
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*360
            cloud.material.opacity = 0.9
            cloudParticles.push(cloud)
            scene.add(cloud)
        }
    })
  
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