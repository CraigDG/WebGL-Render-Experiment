var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var renderer = new THREE.WebGLRenderer();
var setScale = true;


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );

		camera.position.x = 800;
function lights() {
	var ambient = new THREE.AmbientLight(0xFFFFFF);
	var directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(0, 0, 10);
	scene.add(ambient);
	scene.add(directionalLight);
}

var loader = new THREE.ObjectLoader();

var material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('models/texture.png')});

loader.load( 'models/gun.json', function (object) {
    var materialObject = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
    });
    gun = object;
});

var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

loader.load( 'models/marine.json', function (object) {
    var materialObject = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = material2;
        }
    });
    marine = object;
});





var listener = new THREE.AudioListener();
camera.add( listener );
var sound = new THREE.Audio(listener);
var audioLoader = new THREE.AudioLoader();
audioLoader.load('noise/donk.mp3', function( buffer ) {
	sound.setBuffer(buffer);
	sound.setLoop(true);
	sound.setVolume(0.5);
	sound.play();

});
var analyser = new THREE.AudioAnalyser(sound, 512);
	
	




document.addEventListener( 'mousemove', onDocumentMouseMove, false );
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove(event) {
	mouseX = (event.clientX - windowHalfX) / 3;
	mouseY = (event.clientY - windowHalfY) / 3;
}

function animate() {
	requestAnimationFrame( animate );
	averageFrequency = analyser.getAverageFrequency();
	averageFrequency = Math.round(averageFrequency / 120);
	// camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt(gun.position);
	renderer.render( scene, camera );


	if (averageFrequency == 1) {
		scene.remove(marine);
		scene.add(gun);
		gun.scale.x = 2;
		gun.scale.y = 2;
		gun.scale.z = 2;
	} else {		
		scene.remove(gun);
		scene.add(marine);
		marine.position.y = -50;
		marine.rotation.y = 90;
	}
	camera.position.x -=0.7;
	gun.rotation.y += 0.01;
	marine.rotation.x += 0.02;
	marine.rotation.z += 1;
	marine.rotation.y += 0.04;
	render();
}


function render() {

}

function init() {
	lights();
	animate();
}

init();