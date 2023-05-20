"use strict";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    
export function loadmodules(sceneElements) {
    return new Promise((resolve, reject) => {
    // Create a new loader
    const loader = new GLTFLoader();

    // Load the model
    loader.load(
         // path to the model file
        './assets/stickman/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            // get the mesh from the loaded model
            const human = gltf.scene.children[0];

            // do something with the mesh
            human.position.set( 0, 0, 0 );
            human.name = "human"; 
            sceneElements.sceneGraph.add( human );
            resolve(human);
            


        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
});
};

