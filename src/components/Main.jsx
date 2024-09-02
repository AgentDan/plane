import React, {useEffect, useRef} from 'react'
import * as THREE from "three"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import { gsap } from "gsap"
import {ScrollTrigger} from "gsap/ScrollTrigger"
console.clear()

gsap.registerPlugin(ScrollTrigger)

const Main = () => {

    const mountRef = useRef(null)
    const path = `./models/plane/plane.gltf`
    let size = {width: 0, high: 0}

    const COLORS = {
        background: "white",
        light: "#ffffff",
        sky: "#aaaaff",
        ground: "#88ff88",
        blue: "steelblue"
    }
    const styleSection = {display: "flex", outline: "1px solid red", width: "100vw", height: "100vw"}
    const PI = Math.PI

    useEffect(() => {
        const currentRef = mountRef.current
        const {clientWidth: width, clientHeight: height} = currentRef

        // ---SCENE
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(COLORS.background)

        // ---RENDERER
        const renderer = new THREE.WebGLRenderer({antialias: true})
        renderer.physicallyCorrectLights = true
        renderer.outputEncoding = THREE.sRGBEncoding
        renderer.toneMapping = THREE.ReinhardToneMapping
        renderer.toneMappingExposure = 5
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        renderer.setSize(width, height);
        currentRef.appendChild(renderer.domElement)

        // ---CAMERA

        const camera = new THREE.PerspectiveCamera(10, width / height, 0.1, 100);
        scene.add(camera);
        camera.position.set(15, 5, 15);
        camera.lookAt(new THREE.Vector3());
        let cameraTarget = new THREE.Vector3(0, 0.1, 0)

        const onResize = () => {
            renderer.setSize(currentRef.clientWidth, currentRef.clientHeight)
            camera.aspect = currentRef.clientWidth / currentRef.clientHeight
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            camera.updateProjectionMatrix()
        };
        window.addEventListener("resize", onResize);

        // Light
        const pointlight = new THREE.PointLight(0xffffff, 6);
        pointlight.position.set(5, 5, 1);
        scene.add(pointlight);

        const gltfLoader = new GLTFLoader()
        gltfLoader.load(path, (gltf) => {
            scene.add(gltf.scene)
        })

        // ---TICK Animate the scene
        const tick = () => {
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();

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

export default Main;