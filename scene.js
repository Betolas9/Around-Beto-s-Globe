import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import{ initEmptyScene, render } from './helper.js'; 
import{ loadmodules } from './modules.js';

document.getElementById("loading-screen").style.visibility = "visible";

setTimeout(function() {
    // Hide the loading screen
    document.getElementById("loading-screen").style.visibility = "hidden";
}, 1000);

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
initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
// Add event listener to window's resize event
window.addEventListener('resize', resizeWindow);
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

let mixer;
let idleAction;
let runAction;
let currentAnimation = 'idle'; // Initial animation state
let mixer2;

// Create and insert in the scene graph the models of the 3D scene
async function load3DObjects(sceneGraph) {

    /* const human = loadmodules(sceneElements);
    const human = sceneElements.sceneGraph.getObjectByName("human");
    human.position.x = 1; */

    /* const human = await loadmodules(sceneElements); */
    /* sceneElements.sceneGraph.getObjectByName("human");
    human.position.set( 25, 0, 25 ); */

    //background color
    let background = new THREE.TextureLoader().load('./assets/sky/sky.jpg');
    background.wrapS = THREE.RepeatWrapping;
    background.wrapT = THREE.RepeatWrapping;
    background.repeat.set( 1, 1 );
    //move up the background
    background.offset.y = -0.4;
    sceneElements.sceneGraph.background = background;

    const loader = new GLTFLoader();

    // Load the human model
    loader.load(
         // path to the model file
        './assets/stickman/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            // get the mesh from the loaded model
            const human = gltf.scene.children[0];

            // set castShadow property on all child meshes
            human.traverse( function( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    //child.material.color.set(0xffffff);
                }
            });


            // do something with the mesh
            human.position.set( 25, 0, 0 );
            // aumentar o tamanho do boneco
            human.scale.set( 0.01, 0.01, 0.01 );
            // Set shadow property
            human.castShadow = true;
            human.receiveShadow = true;

            //rotate the model
            human.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI);
            human.name = "human"; 
            sceneElements.sceneGraph.add( human );

            // add animation
            
            mixer = new THREE.AnimationMixer( human );
            let clips = gltf.animations;
            let idleClip = THREE.AnimationClip.findByName( clips, 'Idle' );
            let runClip = THREE.AnimationClip.findByName( clips, 'Run' );
            idleAction = mixer.clipAction( idleClip );
            runAction = mixer.clipAction( runClip );
            // Play idle animation by default
            idleAction.play();  

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

    
    const human = sceneElements.sceneGraph.getObjectByName("human");

    // Load the football stadium model
    loader.load(
        // path to the model file
        './assets/football_field_street/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const stadium = gltf.scene.children[0];

            // do something with the mesh
            stadium.position.set( 9, 0.2, -10.5 );
            // aumentar o tamanho do boneco
            stadium.scale.set( 0.6, 0.6, 0.6 );
            // Set shadow property
            stadium.castShadow = true;
            stadium.receiveShadow = true;

            //rotate the model
            stadium.rotateZ(Math.PI);
            stadium.name = "stadium";
            sceneElements.sceneGraph.add( stadium );
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

    const stadium = sceneElements.sceneGraph.getObjectByName("stadium");

    // Load the montain model
    loader.load(
        // path to the model file
        './assets/cherryV1/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                    /*
                    // set roughness to 0
                    child.material.roughness = 0;

                    // set metalness to 0
                    child.material.metalness = 0;

                    // set emissive color to white and intensity to 1
                    /* child.material.emissive.set( 0xffffff );
                    child.material.emissiveIntensity = 0.2; */

                    /* // disable flat shading
                    child.material.flatShading = false;

                    // enable smooth shading
                    child.material.smoothShading = true;

                    // set side to double
                    child.material.side = THREE.DoubleSide;  */

                            
                }
    
            } );

            // get the mesh from the loaded model
            let montain = gltf.scene.children[0];

            // do something with the mesh
            montain.position.set( 0, -2.2, 0 );
            // aumentar o tamanho do boneco
            montain.scale.set( 200, 200, 200 );
            // Set shadow property
            montain.castShadow = true;
            montain.receiveShadow = true;

            //rotate the model
            montain.rotateZ(Math.PI/1.2);
            montain.name = "montain";
            sceneElements.sceneGraph.add( montain );
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
    
    // Load flower pool model
    loader.load(
        // path to the model file
        './assets/flower_poolV1/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const flower_pool = gltf.scene.children[0];

            // do something with the mesh
            flower_pool.position.set( 12, 0.7, 13 );
            // aumentar o tamanho do boneco
            flower_pool.scale.set( 1, 1, 1 );
            // Set shadow property
            flower_pool.castShadow = true;
            flower_pool.receiveShadow = true;

            //rotate the model
            flower_pool.rotateZ(Math.PI/1.6);
            flower_pool.name = "flower_pool";
            sceneElements.sceneGraph.add( flower_pool );
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

    // Load flower pool model
    loader.load(
        // path to the model file
        './assets/pond_fish/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const fish_pool = gltf.scene.children[0];

            // do something with the mesh
            fish_pool.position.set( -15, 1, 3.4);
            // aumentar o tamanho do boneco
            fish_pool.scale.set( 0.5, 0.5, 0.5 );
            // Set shadow property
            fish_pool.castShadow = true;
            fish_pool.receiveShadow = true;

            //rotate the model
            fish_pool.rotateZ(Math.PI/1.6);
            fish_pool.name = "fish_pool";
            sceneElements.sceneGraph.add( fish_pool );

            // add animation to the fish
            mixer2 = new THREE.AnimationMixer( fish_pool );
            let clips2 = gltf.animations;
            let clip2 = THREE.AnimationClip.findByName( clips2, 'Take 001' );
            let action2 = mixer.clipAction( clip2 );
            action2.play();
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
    

    // Load billboard model
    loader.load(
        // path to the model file
        './assets/BillBoard/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const billboard = gltf.scene.children[0];

            // do something with the mesh
            billboard.position.set( 6, 0, -17 );
            // aumentar o tamanho do boneco
            billboard.scale.set( 2, 2, 2 );
            // Set shadow property
            billboard.castShadow = true;
            billboard.receiveShadow = true;

            //rotate the model
            billboard.rotateZ(Math.PI/1.2);
            billboard.name = "billboard";
            sceneElements.sceneGraph.add( billboard );
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

    let baixinhos_geometry = new THREE.PlaneGeometry( 1.75, 2.8 );
    let baixinhos_billboard = new THREE.TextureLoader().load( './assets/equipas/baixinhos_billboard2.png' );
    let baixmaterial = new THREE.MeshBasicMaterial( { map: baixinhos_billboard } );
    let baixinhos = new THREE.Mesh( baixinhos_geometry, baixmaterial );
    baixinhos.position.set( 6.1, 2.6, -17.12 );
    baixinhos.rotateY(Math.PI/1.2);
    baixinhos.name = "baixinhos";
    sceneElements.sceneGraph.add( baixinhos );

    loader.load(
        // path to the model file
        './assets/BillBoard/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const billboard2 = gltf.scene.children[0];

            // do something with the mesh
            billboard2.position.set( 3, 0, -16 );
            // aumentar o tamanho do boneco
            billboard2.scale.set( 2, 2, 2 );
            // Set shadow property
            billboard2.castShadow = true;
            billboard2.receiveShadow = true;

            //rotate the model
            billboard2.rotateZ(Math.PI/1.1);
            billboard2.name = "billboard2";
            sceneElements.sceneGraph.add( billboard2 );
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

    let feirense_geometry = new THREE.PlaneGeometry( 1.75, 2.8 );
    let feirense_billboard = new THREE.TextureLoader().load( './assets/equipas/feirense.png' );
    let feimaterial = new THREE.MeshBasicMaterial( { map: feirense_billboard } );
    let feirense = new THREE.Mesh( feirense_geometry, feimaterial );
    feirense.position.set( 3.06, 2.6, -16.15 );
    feirense.rotateY(Math.PI/1.1);
    feirense.name = "baixinhos";
    sceneElements.sceneGraph.add( feirense );

    loader.load(
        // path to the model file
        './assets/BillBoard/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const billboard3 = gltf.scene.children[0];

            // do something with the mesh
            billboard3.position.set( 0, 0, -16 );
            // aumentar o tamanho do boneco
            billboard3.scale.set( 2, 2, 2 );
            // Set shadow property
            billboard3.castShadow = true;
            billboard3.receiveShadow = true;

            //rotate the model
            billboard3.rotateZ(Math.PI/1.2);
            billboard3.name = "billboard3";
            sceneElements.sceneGraph.add( billboard3 );
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

    let lourosa_geometry = new THREE.PlaneGeometry( 1.75, 2.8 );
    let lourosa_billboard = new THREE.TextureLoader().load( './assets/equipas/lourosa.png' );
    let loumaterial = new THREE.MeshBasicMaterial( { map: lourosa_billboard } );
    let lourosa = new THREE.Mesh( lourosa_geometry, loumaterial );
    lourosa.position.set( 0.1, 2.6, -16.14 );
    lourosa.rotateY(Math.PI/1.2);
    lourosa.name = "lourosa";
    sceneElements.sceneGraph.add( lourosa );

    loader.load(
        // path to the model file
        './assets/BillBoard/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const billboard4 = gltf.scene.children[0];

            // do something with the mesh
            billboard4.position.set( -3, 0, -16 );
            // aumentar o tamanho do boneco
            billboard4.scale.set( 2, 2, 2 );
            // Set shadow property
            billboard4.castShadow = true;
            billboard4.receiveShadow = true;

            //rotate the model
            billboard4.rotateZ(Math.PI/1.2);
            billboard4.name = "billboard4";
            sceneElements.sceneGraph.add( billboard4 );
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

    let espinho_geometry = new THREE.PlaneGeometry( 1.75, 2.8 );
    let espinho_billboard = new THREE.TextureLoader().load( './assets/equipas/espinho.png' );
    let espmaterial = new THREE.MeshBasicMaterial( { map: espinho_billboard } );
    let espinho = new THREE.Mesh( espinho_geometry, espmaterial );
    espinho.position.set( -2.9, 2.6, -16.15 );
    espinho.rotateY(Math.PI/1.2);
    espinho.name = "espinho";
    sceneElements.sceneGraph.add( espinho );

    loader.load(
        // path to the model file
        './assets/BillBoard/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const billboard5 = gltf.scene.children[0];

            // do something with the mesh
            billboard5.position.set( -5, 0, -18 );
            // aumentar o tamanho do boneco
            billboard5.scale.set( 2, 2, 2 );
            // Set shadow property
            billboard5.castShadow = true;
            billboard5.receiveShadow = true;

            //rotate the model
            billboard5.rotateZ(Math.PI/1.6);
            billboard5.name = "billboard5";
            sceneElements.sceneGraph.add( billboard5 );
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


    let s_felix_geometry = new THREE.PlaneGeometry( 1.75, 2.8 );
    let s_felix_billboard = new THREE.TextureLoader().load( './assets/equipas/s_felix.png' );
    let s_felixmaterial = new THREE.MeshBasicMaterial( { map: s_felix_billboard } );
    let s_felix = new THREE.Mesh( s_felix_geometry, s_felixmaterial );
    s_felix.position.set( -4.87, 2.6, -18.08 );
    s_felix.rotateY(Math.PI/1.6);
    s_felix.name = "espinho";
    sceneElements.sceneGraph.add( s_felix );

    //load billboard principal
    loader.load(
        // path to the model file
        './assets/billboard16/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const billboard6 = gltf.scene.children[0];

            // do something with the mesh
            billboard6.position.set( 20, 0, 8 );
            // aumentar o tamanho do boneco
            billboard6.scale.set( 0.5, 0.5, 0.5 );
            // Set shadow property
            billboard6.castShadow = true;
            billboard6.receiveShadow = true;
            
            //rotate the model
            billboard6.rotateZ(Math.PI/1.7);
            billboard6.name = "billboard6";
            sceneElements.sceneGraph.add( billboard6 );
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

    let principal_geometry = new THREE.PlaneGeometry( 7.8, 4 );
    let principal_billboard = new THREE.TextureLoader().load( './assets/equipas/principal.png' );
    let principalmaterial = new THREE.MeshBasicMaterial( { map: principal_billboard } );
    let principal = new THREE.Mesh( principal_geometry, principalmaterial );
    principal.position.set( 16.6, 3.3, 0.5 );
    principal.rotateY(Math.PI/1.7);
    principal.name = "principal";
    sceneElements.sceneGraph.add( principal ); 

    // load billboard to mirtilo
    loader.load(
        // path to the model file
        './assets/billboard16/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const billboard7 = gltf.scene.children[0];

            // do something with the mesh
            billboard7.position.set( -4, 0, -13 );
            // aumentar o tamanho do boneco
            billboard7.scale.set( 0.5, 0.5, 0.5 );
            // Set shadow property
            billboard7.castShadow = true;
            billboard7.receiveShadow = true;
            
            //rotate the model
            billboard7.rotateZ(-Math.PI/1.3);
            billboard7.name = "billboard7";
            sceneElements.sceneGraph.add( billboard7 );
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

    let mirtas_geometry = new THREE.PlaneGeometry( 7.8, 4 );
    let mirtas_billboard = new THREE.TextureLoader().load( './assets/equipas/mirtilocomp.png' );
    let mirtasmaterial = new THREE.MeshBasicMaterial( { map: mirtas_billboard } );
    let mirtas = new THREE.Mesh( mirtas_geometry, mirtasmaterial );
    mirtas.position.set( -9.3, 3.25, -6.7 );
    mirtas.rotateY(-Math.PI/1.3);
    mirtas.name = "mirtas";
    sceneElements.sceneGraph.add(mirtas ); 

    // load billboard to school project 
    loader.load(
        // path to the model file
        './assets/billboard16/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {

                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

            } );

            // get the mesh from the loaded model
            const billboard8 = gltf.scene.children[0];

            // do something with the mesh
            billboard8.position.set( -9, 2, 3 );
            // aumentar o tamanho do boneco
            billboard8.scale.set( 0.4, 0.4, 0.4 );
            // Set shadow property
            billboard8.castShadow = true;
            billboard8.receiveShadow = true;

            //rotate the model
            billboard8.rotateZ(-Math.PI/2.3);
            billboard8.name = "billboard8";
            sceneElements.sceneGraph.add( billboard8 );
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

    let school_geometry = new THREE.PlaneGeometry(6.2, 3.3 );
    let school_billboard = new THREE.TextureLoader().load( './assets/equipas/principal.png' );
    let schoolmaterial = new THREE.MeshBasicMaterial( { map: school_billboard } );
    let school = new THREE.Mesh( school_geometry, schoolmaterial );
    school.position.set( -6.7, 4.5, 9.1 );
    school.rotateY(-Math.PI/2.3);
    school.name = "school";
    sceneElements.sceneGraph.add(school );

    // load billboard to contact me 
    loader.load(
        // path to the model file
        './assets/billboard16/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {


            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {

                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

            } );

            // get the mesh from the loaded model
            const billboard9 = gltf.scene.children[0];

            // do something with the mesh
            billboard9.position.set( -2, 2, 16);
            // aumentar o tamanho do boneco
            billboard9.scale.set( 0.3, 0.3, 0.3 );
            // Set shadow property
            billboard9.castShadow = true;
            billboard9.receiveShadow = true;

            //rotate the model
            //billboard9.rotateZ(-Math.PI/1);
            billboard9.name = "billboard9";
            sceneElements.sceneGraph.add( billboard9 );
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

    let contact_geometry = new THREE.PlaneGeometry( 4.55, 2.5 );
    let contact_billboard = new THREE.TextureLoader().load( './assets/equipas/contact.png' );
    let contactmaterial = new THREE.MeshBasicMaterial( { map: contact_billboard } );
    let contact = new THREE.Mesh( contact_geometry, contactmaterial );
    contact.position.set( 2.9, 3.9, 15.3 );
    contact.rotateY(-Math.PI/0.1);
    contact.name = "contact";
    sceneElements.sceneGraph.add(contact );
    


    //load trophy model
    loader.load(
        // path to the model file
        './assets/world_trophy/scene.gltf',
        // called when the model is loaded
        function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
    
                    child.material.metalness = 0;
    
                    // Set shadow property
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
    
            } );

            // get the mesh from the loaded model
            const trophy = gltf.scene.children[0];

            // do something with the mesh
            trophy.position.set( 0, 0.63,-20 );
            // aumentar o tamanho do boneco
            trophy.scale.set( 0.05, 0.05, 0.05 );
            // Set shadow property
            trophy.castShadow = true;
            trophy.receiveShadow = true;
            

            //rotate the model

            trophy.name = "trophy";
            sceneElements.sceneGraph.add( trophy );
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

    let trophy = sceneElements.sceneGraph.getObjectByName("trophy");
    
    // add spotlight above human
    let humanspotLight = new THREE.SpotLight( 0xffffff, 0.4 ,30, 0.5);
    humanspotLight.position.set( 27, 4,-1 );
    //setup shadow properties for the spotLight
    humanspotLight.castShadow = true;
    humanspotLight.shadow.mapSize.width = 512;  // default
    humanspotLight.shadow.mapSize.height = 512; // default
    humanspotLight.shadow.bias = -0.009;
    humanspotLight.name = "humanspotLight";
    sceneElements.sceneGraph.add( humanspotLight );
 
    
    // add spotlight above the trophy
    let trophyspotLight = new THREE.SpotLight( 0xffffff, 4 ,10, 0.3);
    trophyspotLight.position.set( 0, 8,-24 );
    //setup shadow properties for the spotLight
    trophyspotLight.castShadow = true;
    trophyspotLight.shadow.mapSize.width = 512;  // default
    trophyspotLight.shadow.mapSize.height = 512; // default
    trophyspotLight.shadow.bias = -0.009;
    trophyspotLight.name = "trophyspotLight";
    sceneElements.sceneGraph.add( trophyspotLight );
    let targetObject = new THREE.Object3D(); 
    targetObject.position.set(0, 0, -20);
    sceneElements.sceneGraph.add(targetObject);
    trophyspotLight.target = targetObject;


    // helper to visualize the light's position and target
    let trophyspotLightHelper = new THREE.SpotLightHelper( trophyspotLight );
    sceneElements.sceneGraph.add( trophyspotLightHelper );

            


    // Create a circular sidewalk
    const sidewalkGeometry = new THREE.RingGeometry( 24, 26, 60 );
    const roadtexture = new THREE.TextureLoader().load('./assets/road/road2.jpg');
    roadtexture.wrapS = THREE.RepeatWrapping;
    roadtexture.wrapT = THREE.RepeatWrapping;
    roadtexture.repeat.set( 20, 20 );
    const sidewalkMaterial = new THREE.MeshStandardMaterial( { 
        map: roadtexture, side: THREE.DoubleSide } );
    const sidewalk = new THREE.Mesh( sidewalkGeometry, sidewalkMaterial );
    sidewalk.position.set(0, 0.1, 0);
    sidewalk.rotateX(Math.PI/2);
    sidewalk.castShadow = true;
    sidewalk.receiveShadow = true;
    sidewalk.name = "sidewalk";
    sceneElements.sceneGraph.add( sidewalk );






    // ************************** //
    // Create a ground plane
    // ************************** //
    /* const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(120, 134, 107)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true; */


    // ************************** //
    // Create a Cone / montain
    // ************************** //
    // Cone center is at (0,0,0)
    /* const conegeometry = new THREE.ConeGeometry( 20, 6, 15 );
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
 */

    // ************************** //
    // Create a sphere / football
    // ************************** //
    const sphereGeometry = new THREE.SphereGeometry(0.8, 25, 25);
    //const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00});
    const balltexture = new THREE.TextureLoader().load('./assets/football/footballpattern.jpg');
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: balltexture });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sceneGraph.add(sphere);
    sphere.position.set(17, 2, -6);
    sphere.name = "sphere";

    // Set shadow property
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    // ************************** //
    // Create a house 
    // ************************** //
    /* const houseGeometry = new THREE.BoxGeometry(3, 3, 8);
    const houseMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513});
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    sceneGraph.add(house);
    house.position.set(11, 2, -10);
    house.name = "house";
    house.rotateY(Math.PI / 4);

    // Set shadow property
    house.castShadow = true; */

    // ************************** //
    // Create a cylinder
    // ************************** //
    const cylinderGeometry = new THREE.CylinderGeometry(0, 0, 0, 25, 1);
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
    //rotacao.add(human);
    rotacao.add(cylinder);
    rotacao.add(camera);
    rotacao.add(humanspotLight);

    // light above the cylinder
    const above = sceneElements.sceneGraph.getObjectByName("above");
    above.target = cylinder;
    rotacao.add(above);
    humanspotLight.target = cylinder;

    rotacao.name = "rotacao";
    sceneGraph.add(rotacao);

    const axisHelper = new THREE.AxesHelper(5); // creates an axis helper with a length of 5 units
    sceneGraph.add(axisHelper);

}

let startTime = 0;
//let lightOn = false;
let direita = true;
let clock = new THREE.Clock();

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
    const human = sceneElements.sceneGraph.getObjectByName("human");
    
    if (human) {
        rotacao.add(human);
    }

    //sphere jumping up and down
    sphere.position.y= 3 + Math.sin(time/200)*2;

    // Toggle light dark area
    if (rotacao.rotation.y > 1.38) {
        above.intensity = 1.5;
        //lightOn = !lightOn;
    }
    else if (rotacao.rotation.y < -1.38) {
        above.intensity = 0;
    }
/*     else {  
        above.intensity = 0;
    } */
    
    if (keyD || keyRight) {
        if (direita == false) {
            human.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI);
            direita = true;
        }

        if (currentAnimation != "run") {
            // Stop idle animation if it's playing
            if (currentAnimation == 'idle' && idleAction.isRunning()) {
                idleAction.stop();
            }
            runAction.play();
            currentAnimation = "run";
        }

        rotacao.rotateY(0.004);
        
        camera.lookAt(rotacao.position);
        console.log(rotacao.rotation.y);
    
    } else if (keyA || keyLeft) {
        if (direita == true) {
            human.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI);
            direita = false;
        }

        if (currentAnimation != 'run' && !runAction.isRunning()) {
            // Stop idle animation if it's playing
            if (currentAnimation === 'idle' && idleAction.isRunning()) {
                idleAction.stop();
            }
            runAction.play();
            currentAnimation = 'run';
        }

        rotacao.rotateY(-0.004);
        camera.lookAt(rotacao.position);
        console.log(rotacao.rotation.y);
    } else {
        if (idleAction && currentAnimation !== 'idle') {
            // Stop run animation if it's playing
            if (currentAnimation === 'run' && runAction.isRunning()) {
                runAction.stop();
            }
            idleAction.play();
            currentAnimation = 'idle';
        }
    }   

    if (mixer){
        mixer.update(clock.getDelta());
    }

    if (mixer2){
        mixer2.update(clock.getDelta());
    }
    
  
    // Rendering
    render(sceneElements);

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}
