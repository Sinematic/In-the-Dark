import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


/*
 * Instances
*/
const gui = new GUI()
const canvas = document.querySelector('canvas.webgl')

/* Scene  */
const scene = new THREE.Scene()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const tilesTexture = textureLoader.load('./static/textures/Stylized_Terracotta_Tiles_001_basecolor.png')
const tilesAmbientOcclusionTexture = textureLoader.load('./static/textures/Stylized_Terracotta_Tiles_001_ambientOcclusion.png')
const tilesHeightTexture = textureLoader.load('./static/textures/Stylized_Terracotta_Tiles_001_height.png')
const tilesNormalTexture = textureLoader.load('./static/textures/Stylized_Terracotta_Tiles_001_normal.png')
const tilesRoughnessTexture = textureLoader.load('./static/textures/Stylized_Terracotta_Tiles_001_roughness.png')

const floorTexture = textureLoader.load('./static/textures/Stylized_Stone_Floor_001b_basecolor.png')
const floorAmbientOcclusionTexture = textureLoader.load('./static/textures/Stylized_Stone_Floor_001b_ambientOcclusion.png')
const floorHeightTexture = textureLoader.load('./static/textures/Stylized_Stone_Floor_001b_height.png')
const floorNormalTexture = textureLoader.load('./static/textures/Stylized_Stone_Floor_001b_normal.png')
const floorRoughnessTexture = textureLoader.load('./static/textures/Stylized_Stone_Floor_001b_roughness.png')

const wallTexture = textureLoader.load('./static/textures/Concrete_Blocks_007_basecolor.jpg')
const wallAmbientOcclusionTexture = textureLoader.load('./static/textures/Concrete_Blocks_007_ambientOcclusion.jpg')
const wallHeightTexture = textureLoader.load('./static/textures/Concrete_Blocks_007_height.jpg')
const wallNormalTexture = textureLoader.load('./static/textures/Concrete_Blocks_007_normal.jpg')
const wallRoughnessTexture = textureLoader.load('./static/textures/Concrete_Blocks_007_roughness.jpg')

/**
 * Materials
*/


const tilesMaterial = new THREE.MeshStandardMaterial({
    map: tilesTexture,
    aoMap: tilesAmbientOcclusionTexture,
    normalMap: tilesNormalTexture,
    roughnessMap: tilesRoughnessTexture,
    roughness: 1, 
    displacementMap: tilesHeightTexture,
    displacementScale: 0.1
})

const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    aoMap: floorAmbientOcclusionTexture,
    normalMap: floorNormalTexture,
    roughnessMap: floorRoughnessTexture,
    roughness: 1, 
    displacementMap: floorHeightTexture,
    displacementScale: 0.1
})

const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    aoMap: wallAmbientOcclusionTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture,
    roughness: 1,  
    displacementMap: wallHeightTexture,
    displacementScale: 0.1
})

/*
    Objects
*/

const room = new THREE.Group()
scene.add(room)

const roomWidth = 20
const roomHeight = 6

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomWidth),
    floorMaterial
)

floor.rotation.x = - Math.PI / 2
floor.position.y = 0
room.add(floor)

for(let i = 0; i < 4; i++)
{
    const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomHeight),
        wallMaterial
    )

    wall.material.side = THREE.DoubleSide

    wall.position.y = 2

    if(i == 0) 
    {
        wall.position.set(0, roomHeight / 2, -(roomWidth / 2))
    }

    if(i == 1) 
    {
        wall.position.set(-(roomWidth / 2), roomHeight / 2, 0)
        wall.rotation.y = Math.PI / 2
    }

    if (i == 2)
    {
        wall.position.set(roomWidth / 2, roomHeight / 2, 0)
        wall.rotation.y = - Math.PI / 2
    }

    if(i == 3) 
    {
        wall.position.set(0, roomHeight / 2, roomWidth / 2)
    }

    room.add(wall)
}

 /**
 * Lights
*/

const spotLightIssues = [0.3, 0.2, 0.25, 1, 0.35, 0.25, 0.52, 0.25, 0.7, 0.65, 0.39, 0.51, 1, 1, 1, 1]

const lightTweaks = gui.addFolder('Lights')

const ambientLight = new THREE.AmbientLight(0xffffff, 0)
scene.add(ambientLight)

lightTweaks.add(ambientLight, 'intensity').min(0).max(10).step(0.01).name('Ambient')

const directionalLight = new THREE.DirectionalLight(0xffffff, 0)
directionalLight.position.set(10, 10,)
scene.add(directionalLight)

lightTweaks.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('Directional')

const spotLight = new THREE.SpotLight(0xfffcaa, 13, 30, Math.PI / 4, 0.48)
spotLight.position.y = 9
scene.add(spotLight)

lightTweaks.add(spotLight, 'intensity').min(0).max(20).step(0.01).name('Spotlight')
lightTweaks.add(spotLight, 'penumbra').min(0).max(1).step(0.001).name('Penumbra')



/*
*   Game
*/

let moveSpeed = 0.1
let moveForward = false
let moveBackward = false

const onKeyUp = (event) => 
{
    switch(event.code)
    {
        case 'ArrowUp':
        case 'KeyZ':
            moveForward = true
            break
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true
            break
    }
}

const onKeyDown = (event) => 
    {
        switch(event.code)
        {
            case 'ArrowUp':
            case 'KeyZ':
                moveForward = false
                break
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false
                break
        }
    }

document.addEventListener('keydown', onKeyUp)
document.addEventListener('keyup', onKeyDown)

/**
 * Sizes
*/

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
*/

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = roomHeight
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const fixedAngle = Math.PI / 3
// const fixedHeight = 2

controls.minDistance = 1.2
controls.maxDistance = (roomWidth / 2) - 0.1

controls.minPolarAngle = fixedAngle
controls.maxPolarAngle = fixedAngle

/*
    Renderer
*/

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/*
    Animate
*/

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if(Math.floor(elapsedTime) % 5 == 0) // Mise en place d'une animation approximative de problèmes de lumières
    {
        spotLight.intensity = 13 * spotLightIssues[Math.floor(elapsedTime * 23) % spotLightIssues.length]
    } else spotLight.intensity = spotLightIssues[spotLightIssues.length -1] * 13

    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()