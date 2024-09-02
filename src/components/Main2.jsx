import React, {useEffect, useRef} from 'react'
import * as THREE from "three"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import { gsap } from "gsap"
import {ScrollTrigger} from "gsap/ScrollTrigger"
console.clear()

gsap.registerPlugin(ScrollTrigger)

const Main2 = () => {

    const mountRef = useRef(null)

    const COLORS = {
        background: "white",
        light: "#ffffff",
        sky: "#aaaaff",
        ground: "#88ff88",
        blue: "steelblue"
    }
    const styleSection = {display: "flex", outline: "1px solid red", width: "100vw", height: "100vw"}

    useEffect(() => {
        const currentRef = mountRef.current
        const {clientWidth: width, clientHeight: height} = currentRef

        // ---SCENE

        const scenes = {
            one: new THREE.Scene(),
            two: new THREE.Scene()
        }
        let size = {width: 0, high: 0}

        scenes.one.background = new THREE.Color(COLORS.ground)
        scenes.two.background = new THREE.Color(COLORS.blue)

        const views = [
            {scene: scenes.one, camera: null},
            {scene: scenes.two, camera: null},
        ]

        // ---RENDERER
        const renderer = new THREE.WebGLRenderer({antialias: true})
        renderer.physicallyCorrectLights = true
        renderer.outputEncoding = THREE.sRGBEncoding
        renderer.toneMapping = THREE.ReinhardToneMapping
        renderer.toneMappingExposure = 5
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        console.log(width)
        renderer.setSize(width, height);
        currentRef.appendChild(renderer.domElement)

        // ---CAMERA

        let cameraTarget = new THREE.Vector3(0, 0.1, 0)

        views[0].camera = new THREE.PerspectiveCamera(40, size.width, 0.1, 100)
        views[0].camera.position.set(0, 0, 2)
        views[0].scene.add(views[0].camera)
        views[1].camera = new THREE.PerspectiveCamera(40, size.width, 0.1, 100)
        views[1].camera.position.set(0, 1, 2)
        views[1].scene.add(views[1].camera)

        const camera = new THREE.PerspectiveCamera(10, width / height, 0.1, 100);
        scene.add(camera);
        camera.position.set(15, 5, 15);
        camera.lookAt(new THREE.Vector3());

        // Light
        const pointlight = new THREE.PointLight(0xffffff, 6);
        pointlight.position.set(5, 5, 1);
        scene.add(pointlight);

        const directionalLight = new THREE.DirectionalLight(COLORS.light, 2)
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.far = 10;
        directionalLight.shadow.mapSize.set(1024, 1024);
        directionalLight.shadow.normalBias = 0.05;
        directionalLight.position.set(2, 5, 3);

// views[0].scene.add(directionalLight)
        views[1].scene.add(directionalLight)

        const hemisphereLight = new THREE.HemisphereLight(COLORS.sky, COLORS.ground, 0.5)
// views[0].scene.add(hemisphereLight)
        views[1].scene.add(hemisphereLight)


        const onResize = () => {
            // renderer.setSize(currentRef.clientWidth, currentRef.clientHeight)
            // camera.aspect = currentRef.clientWidth / currentRef.clientHeight
            // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            // camera.updateProjectionMatrix()

            size.width = container.clientWidth
            size.height = container.clientHeight

            views[0].camera.aspect = size.width / size.height
            views[0].camera.updateProjectionMatrix()

            views[1].camera.aspect = size.width / size.height
            views[1].camera.updateProjectionMatrix()

            renderer.setSize(size.width, size.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        };
        window.addEventListener("resize", onResize);

        // ---TICK Animate the scene
        const tick = () => {
            // renderer.render(scene, camera);

            views[0].camera.lookAt(cameraTarget)
            views[1].camera.lookAt(cameraTarget)

            let bottom = size.height * 0
            let height = size.height * 1
            renderer.setViewport(0, 0, size.width, size.height)
            renderer.setScissor(0, bottom, size.width, height)
            renderer.setScissorTest(true)
            renderer.render(views[0].scene, views[0].camera);

            bottom = size.height * 0.5
            height = size.height * 0.2
            renderer.setViewport(0, 0, size.width, size.height)
            renderer.setScissor(0, bottom, size.width, height)
            renderer.setScissorTest(true)
            renderer.render(views[1].scene, views[1].camera);

            requestAnimationFrame(tick);
        };
        tick();

        const gltfLoader = new GLTFLoader()
        gltfLoader.load("./models/plane/plane.gltf", (gltf) => {
            scene.add(gltf.scene)
        })
        gltfLoader.load('./models/suzanne3/suzanne3.gltf', (gltf) => {
            views[0].scene.add(gltf.scene)
        })
        gltfLoader.load('./models/plane/plane.gltf', (gltf) => {
            views[1].scene.add(gltf.scene)
        })


        return () => {
            window.removeEventListener("resize", onResize);
            currentRef.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div>
            <div
                ref={mountRef}
                style={{width: "100%", height: "100vh"}}
                className="z-1 top-0 left-0 fixed w-[100%] h-[100%]"
            >
            </div>
            <div style={{zIndex: 2, position: "relative"}}>
                <div style={styleSection}>
                    OnePage
                </div>
                <div style={styleSection}>
                    OnePage
                </div>
                <div style={styleSection}>
                    OnePage
                </div>
                <div style={styleSection}>
                    OnePage
                </div>
                <div style={styleSection}>
                    OnePage
                </div>
            </div>
        </div>
    )
}

export default Main2;