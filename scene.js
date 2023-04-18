"use strict";

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
// 		J. Madeira - April 2021





// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    // control: null,
    renderer: null,
};


// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Render the scene
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false, keyRight = false, keyLeft = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break; 
        case 39:  // right arrow
            keyRight = true;
            break;
        case 37:  // left arrow
            keyLeft = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
        case 39:  // right arrow
            keyRight = false;
            break;
        case 37:  // left arrow
            keyLeft = false;
            break;
    }
}

//////////////////////////////////////////////////////////////////
    


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // ************************** //
    // Create a ground plane
    // ************************** //
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(120, 134, 107)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;


    // ************************** //
    // Create a Cone / montain
    // ************************** //
    // Cone center is at (0,0,0)
    const conegeometry = new THREE.ConeGeometry( 20, 6, 15 );
    const conematerial = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    const cone = new THREE.Mesh( conegeometry, conematerial );
    sceneGraph.add( cone );
    cone.name = "cone";

    // Set position of the cone
    // The base of the cone will be on the plane 
    cone.translateY(3);

    // Set shadow property
    cone.castShadow = true;
    cone.receiveShadow = true;

    // ************************** //
    // Create a billboard //
    // ************************** //
    // create a canvas element
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    // get the canvas context and draw some text
    var ctx = canvas.getContext('2d');
    ctx.font = 'Bold 20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("Welcome to", 20, 50);
    ctx.fillText("Around Beto's Globe", 20, 80);

    // create a texture from the canvas
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    // create a material using the texture
    var billboardMaterial = new THREE.MeshBasicMaterial({map: texture});


    const billboardGeometry = new THREE.PlaneGeometry(8, 5);
    //const billboardMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255, 255, 255)', side: THREE.DoubleSide });
    const billboardObject = new THREE.Mesh(billboardGeometry, billboardMaterial);
    sceneGraph.add(billboardObject);

    // Change orientation of the plane using rotation
    billboardObject.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    // Set shadow property
    billboardObject.receiveShadow = true;

    // Set position of the billboard
    // The base of the billboard will be on the plane
    billboardObject.translateX(0).translateY(2.5).translateZ(18);

    // ************************** //
    // Create a sphere
    // ************************** //
    const sphereGeometry = new THREE.SphereGeometry(0.8, 25, 25);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sceneGraph.add(sphere);
    sphere.position.set(17, 2, -7);
    sphere.name = "sphere";

    // Set shadow property
    sphere.castShadow = true;

    // ************************** //
    // Create a house 
    // ************************** //
    const houseGeometry = new THREE.BoxGeometry(3, 3, 8);
    const houseMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513});
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    sceneGraph.add(house);
    house.position.set(11, 2, -10);
    house.name = "house";
    house.rotateY(Math.PI / 4);

    // Set shadow property
    house.castShadow = true;

    // ************************** //
    // Create a cylinder
    // ************************** //
    const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 25, 1);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xcd853f});
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    sceneGraph.add(cylinder);
    cylinder.name = "cylinder";

    // Set position of the cylinder
    // Move to the right and towards the camera
    // The base of the cylinder is on the plane
    cylinder.translateX(24).translateY(0.75).translateZ(0);

    // Set shadow property
    cylinder.castShadow = true;

    const camera = sceneElements.sceneGraph.getObjectByName("camera");
    //helpers to rotate the objects
    const rotacao = new THREE.Object3D();
    rotacao.add(cylinder);
    rotacao.add(camera);

    // light above the cylinder
    const above = sceneElements.sceneGraph.getObjectByName("above");
    above.target = cylinder;
    rotacao.add(above);

    rotacao.name = "rotacao";
    sceneGraph.add(rotacao);

    const axisHelper = new THREE.AxesHelper(5); // creates an axis helper with a length of 5 units
    sceneGraph.add(axisHelper);

    // ************************** //
    // Object loader

    // import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    
    // const loader = new GLTFLoader();

    // loader.load( './assets/stickman/scene.gltf', function ( gltf ) {

	//     sceneGraph.add( gltf.scene );
    
    // }, undefined, function ( error ) {

	//     console.error( error );

    // } ); 

}

let startTime = 0;
//let lightOn = false;

function computeFrame(time) {
    // Compute elapsed time since the start of the animation
    const elapsedTime = time - startTime;

    // cylinder making a circle
    const cylinder = sceneElements.sceneGraph.getObjectByName("cylinder");
    const rotacao = sceneElements.sceneGraph.getObjectByName("rotacao");
    const Spotlight = sceneElements.sceneGraph.getObjectByName("Spotlight");
    const camera = sceneElements.sceneGraph.getObjectByName("camera");
    const above = sceneElements.sceneGraph.getObjectByName("above");
    const sphere = sceneElements.sceneGraph.getObjectByName("sphere");

    //sphere jumping up and down
    sphere.position.y= 2 + Math.sin(time/200);

    // Toggle light dark area
    if (rotacao.rotation.y > 1.25) {
        above.intensity = 1.5;
        //lightOn = !lightOn;
    }
    else if (rotacao.rotation.y < -1.25) {
        above.intensity = 0;
    }
/*     else {  
        above.intensity = 0;
    } */
    
    if (keyD || keyRight) {
        rotacao.rotateY(0.004);
        //camera rotate arround the object
        /* camera.position.x = 10 * Math.sin(rotacao.rotation.y + Math.PI * 2);
        camera.position.z = 5 * Math.cos(rotacao.rotation.y + Math.PI * 2);
        camera.position.y = 5;
 */
        camera.lookAt(rotacao.position);
        console.log(rotacao.rotation.y);
    }

    if (keyA || keyLeft) {
        rotacao.rotateY(-0.004);
        camera.lookAt(rotacao.position);
        console.log(rotacao.rotation.y);
    }    
    
  
    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    //sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}
