import * as THREE from 'three';
const $ = require("jquery");

const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.y = .1;

const scene = new THREE.Scene();

{
	const loader = new THREE.CubeTextureLoader();
	const texture = loader.load([
		'textures/cubemap/px.png',
		'textures/cubemap/nx.png',
		'textures/cubemap/py.png',
		'textures/cubemap/ny.png',
		'textures/cubemap/pz.png',
		'textures/cubemap/nz.png',
	]);
	scene.background = texture;
}

// {
// 	const geometry = new THREE.PlaneGeometry(1, 1);
// 	const loader = new THREE.TextureLoader();
// 	const plane_texture = loader.load('textures/a.jpg');
// 	const material = new THREE.MeshBasicMaterial({
// 		color: 0xFF8844,
// 		map: plane_texture
// 	});
// 	const mesh = new THREE.Mesh(geometry, material);
// 	mesh.rotation.x = Math.PI / 2;
// 	scene.add(mesh);
// }

const desired_quat = new THREE.Quaternion(-.697, -.697, -.111, -.124);

camera.setRotationFromQuaternion(desired_quat);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

render();

function render() {
	renderer.render(scene, camera);
}

var cori_quats = null;

function animation(time0) {
	const time = time0 - 5000;
	if (cori_quats != null && time > 0) {
		const quat = new THREE.Quaternion();
		quat.copy(cori_quats[Math.trunc((time / 1000 * 60) % cori_quats.length)]);
		quat.invert();
		quat.premultiply(desired_quat);
		camera.setRotationFromQuaternion(quat);
	}

	render();
}

$.getJSON("GX011920_1_CORI.json", function (json) {
	cori_quats = json["1"]["streams"]["CORI"]["samples"].map(function (x) { return (new (Function.prototype.bind.apply(THREE.Quaternion, x["value"]))); });
	console.log(cori_quats);
});