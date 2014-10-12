/*global THREE, define */

define(function (require) {
    var ObjectBuilder = require('ObjectBuilder');
    var funcs = require('functions');
    require('GimbalFreeOrbitControls');


    var scene = new THREE.Scene();
    var world = new THREE.Object3D();
    scene.add(world);


    var aspectRatio = window.innerWidth / window.innerHeight;
    var height = 4.5;
    var width = 4.5 * aspectRatio;
    var camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 100);
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 3;


    var antialias = false;
    var renderer = new THREE.WebGLRenderer({ antialias: antialias });
    renderer.setClearColor(0x333333);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    var curves = [];
    for (var i = 0.0; i < 2.0; i += 0.1) {
        curves.push(ObjectBuilder.buildCurve(funcs.gauss, i));
    }

    var surface = ObjectBuilder.buildSurface(funcs.gauss);
    var axes = ObjectBuilder.buildAxes();

    world.add(surface);
    curves.forEach(function (curve) {
        world.add(curve);
    });
    world.add(axes);


    world.rotation.x = -Math.PI / 2.4;
    world.rotation.z = -Math.PI / 1.6;
    //world.rotation.x = -1;
    //world.rotation.z = -2;


    var animate = function () {
        requestAnimationFrame(animate, renderer.domElement);
        controls.update();
    };

    var render = function () {
        renderer.render(scene, camera);
    };

    //var controls = new THREE.OrbitControls(camera, renderer.domElement);
    var controls = new THREE.GimbalFreeOrbitControls(world, renderer.domElement);
    controls.addEventListener('change', render);

    render();
    animate();
});
