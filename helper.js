import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 

//const helper = {

    //initEmptyScene: function (sceneElements) {
export function initEmptyScene(sceneElements) {
        // ************************** //
        // Create the 3D scene
        // ************************** //
        sceneElements.sceneGraph = new THREE.Scene();


        // ************************** //
        // Add camera
        // ************************** //
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(39, 7, 0);
        camera.lookAt(0, 0, 0);

        // ************************** //
        // Control for the camera 
        /* sceneElements.control = new THREE.OrbitControls(camera);
        sceneElements.control.screenSpacePanning = true; */

        sceneElements.sceneGraph.add(camera)
        camera.name = "camera";
        


        // ************************** //
        // Illumination
        // ************************** //

        // ************************** //
        // Add ambient light
        // ************************** //
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
        sceneElements.sceneGraph.add(ambientLight);

        // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        const spotLight = new THREE.SpotLight('rgb(255, 255, 255)', 1,500,0.7);
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
        const above = new THREE.SpotLight( 0xffffff,0, 10, 0.6 );
        above.position.set(23, 2.6, 0);
        sceneElements.sceneGraph.add(above);
        above.name = "above";
        //setup shadow properties for the spotlight
        above.castShadow = true;
        above.shadow.mapSize.width = 2048;
        above.shadow.mapSize.height = 2048;
        above.shadow.bias = -0.0003;


        let helper3 = new THREE.CameraHelper ( spotLight.shadow.camera );
        sceneElements.sceneGraph.add( helper3 );




        // *********************************** //
        // Create renderer (with shadow map)
        // *********************************** //
        const renderer = new THREE.WebGLRenderer({ antialias: true });
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
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.screenSpacePanning = true;


        // **************************************** //
        // Add the rendered image in the HTML DOM
        // **************************************** //
        const htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);
    };

    //render: function render(sceneElements) {
    export function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    };