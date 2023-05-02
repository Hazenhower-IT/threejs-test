<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import { ARButton } from "three/examples/jsm/webxr/ARButton"
import * as THREE from "three"

let scene = new THREE.Scene()
let renderer
let controls

let shownModel
let loadedModel
let modelName ="zombie-car"

let reticle

let hitTestSource = null
let hitTestSourceRequested = false

let canvasRef = ref()
let overlayContentRef = ref()

let ambientLight = new THREE.AmbientLight("#c0c0c0",1)

scene.add(ambientLight)

let directionalLight = new THREE.DirectionalLight("#ffffff",1)
directionalLight.position.set(-1, 2, 4)
scene.add(directionalLight)

let camera = new THREE.PerspectiveCamera(
    75, //vertical field of view
    window.innerWidth/window.innerHeight, //aspect ratio
    0.1, //near plane
    100 //far plane
)
camera.position.y=1
camera.position.z=3
camera.lookAt( new THREE.Vector3(0, 0, 0))
scene.add(camera)

reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial()
)
reticle.matrixAutoUpdate = false
reticle.visible = false

scene.add(reticle)

let loop = (timestamp, frame) => {

    if(renderer.xr.isPresenting){
        shownModel.visible = false
    }

    if(frame){
        const referenceSpace = renderer.xr.getReferenceSpace()
        let session = renderer.xr.getSession()

        if(hitTestSourceRequested === false){
            session.requestReferenceSpace("viewer").then((referenceSpace)=>{
                session.requestHitTestSource({space: referenceSpace}).then((source)=>{
                    hitTestSource = source;
                })
            })
            
            hitTestSourceRequested = true

            session.addEventListener("end", ()=>{
                hitTestSourceRequested = false;
                hitTestSource = null
            })
        }
        
        if (hitTestSource){
            const hitTestResult = frame.getHitTestResults(hitTestSource)
            if(hitTestResult.length>0){
                const hit = hitTestResult[0]
                reticle.visible = true
                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix)
            }else{
                reticle.visible = false
            }
        }
    }

    scene.children.forEach((object)=>{
        if(object.name === modelName){
            object.rotation.y += 0.02
        }
    })
    controls.update()
    renderer.render(scene, camera)
    
}

let resizeCallback=()=>{
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect= window.innerWidth/window.innerHeight
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
    renderer.xr.enabled = true;

    renderer.setAnimationLoop(loop)

    document.body.appendChild(ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay:{
            root: overlayContentRef.value,

        }
    }))
    
    controls = new OrbitControls(camera, canvasRef.value)
    controls.enableDamping = true

    // Load a model
    const gltfloader = new GLTFLoader()
    let dracoloader = new DRACOLoader()
    dracoloader.setDecoderPath("/draco/")
    gltfloader.setDRACOLoader(dracoloader)

    gltfloader.load(`/models/${modelName}.gltf`, (gltf)=>{
        loadedModel = gltf.scene.children[0]

        shownModel = loadedModel.clone()
        shownModel.name = modelName
        shownModel.position.set(0,0,0)
        scene.add(shownModel)
        
    })

    //add event for resizing content (Responsiveness)
    window.addEventListener("resize", resizeCallback)

    function onSelect(){
        if(reticle.visible && loadedModel){
            let model = loadedModel.clone()
            model.name  = `XR-${modelName}`
            model.position.setFromMatrixPosition(reticle.matrix)
            model.scale.set(0.3, 0.3, 0.3)
            scene.add(model)
        }
    }

    let controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect)
})

onUnmounted(()=>{
    renderer.setAnimationLoop(null)
})

</script>

<template>
    
    <div>

        <div class="overlay-content" ref="overlayContentRef">
            <h1>
                {{ modelName }}
            </h1>
        </div>

        <canvas ref="canvasRef"></canvas>
    
    </div>

</template>

<style scoped>
.overlay-content{
    position:absolute;
    width: 100%;
}

h1{
    color:white;
    margin: 2rem;
    text-align:center;
    font-family: Arial, Helvetica, sans-serif;
}
</style>