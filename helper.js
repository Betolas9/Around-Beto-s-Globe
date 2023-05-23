import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initEmptyScene(sceneElements) {
        // ************************** //
        // Create the 3D scene
        // ************************** //
        sceneElements.sceneGraph = new THREE.Scene();

        // ************************** //
        // Add camera
        // ************************** //
        let width = window.innerWidth;
        let height = window.innerHeight;
        let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(39, 7, 0);
        camera.lookAt(0, 0, 0);

        // ************************** //
        // Control for the camera 

        sceneElements.sceneGraph.add(camera)
        camera.name = "camera";
    
        // ************************** //
        // Illumination
        // ************************** //
        // Add ambient light
        // ************************** //
        let ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
        sceneElements.sceneGraph.add(ambientLight);

        // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        let spotLight = new THREE.SpotLight('rgb(255, 255, 255)', 1,500,0.7);
        spotLight.position.set(-20, 25, 0, );
        sceneElements.sceneGraph.add(spotLight);

        // Setup shadow properties for the spotlight
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.bias = -0.00003;
        spotLight.name = "Spotlight";

        // ************************** //
        // Add spotlight above cylinder
        // ************************** //
        let above = new THREE.SpotLight( 0xffffff,0, 10, 0.6 );
        above.position.set(23, 2.6, 0);
        sceneElements.sceneGraph.add(above);
        above.name = "above";
        //setup shadow properties for the spotlight
        above.castShadow = true;
        above.shadow.mapSize.width = 2048;
        above.shadow.mapSize.height = 2048;
        above.shadow.bias = -0.0003;

        // light helpers
        /* let spotlightHelper = new THREE.SpotLightHelper ( spotLight );
        sceneElements.sceneGraph.add( spotlightHelper );

        let spotlightHelper2 = new THREE.SpotLightHelper ( above );
        sceneElements.sceneGraph.add( spotlightHelper2 ); */

        // *********************************** //
        // Create renderer (with shadow map)
        // *********************************** //
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor('rgb(135, 206, 235)', 1.0);
        renderer.setSize(width, height);

        // Setup shadowMap property
        renderer.shadowMap.enabled = true;
        //renderer.shadowMap.bias = -1000;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // ************************** //
        // Orbit control
        // ************************** //
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enabledPan = false;
        controls.enableRotate = false;
        controls.maxDistance = 40;
        controls.minDistance = 25;

        // **************************************** //
        // Add the rendered image in the HTML DOM
        // **************************************** //
        let htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);
    };

    //render: function render(sceneElements) {
    export function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    };