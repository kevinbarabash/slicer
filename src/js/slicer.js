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

    var xMin = -2.0;
    var xMax = 2.0;
    var yMin = -2.0;
    var yMax = 2.0;

    var func = funcs.gauss;
    var count = 16;

    var curves = [];

    for (var i = -2.0; i < 2.0; i += 0.25) {
        curves.push(ObjectBuilder.buildCurve(func, i));
    }

    var xSlices = [];
    var xCount = count;
    var xStep = (xMax - xMin) / xCount;
    for (var i = 0, x = xMin; i <= xCount; i++) {
        xSlices.push(ObjectBuilder.buildXSlice(yMin, yMax, func, x));
        x += xStep
    }

    var ySlices = [];
    var yCount = count;
    var yStep = (yMax - yMin) / yCount;
    for (var i = 0, y = yMin; i <= yCount; i++) {
        ySlices.push(ObjectBuilder.buildYSlice(xMin, xMax, func, y));
        y += yStep;
    }

    var surface = ObjectBuilder.buildSurface(func);
    var axes = ObjectBuilder.buildAxes();

    var xSlicesObj = new THREE.Object3D();
    xSlices.forEach(function (slice) {
        xSlicesObj.add(slice);
    });

    var ySlicesObj = new THREE.Object3D();
    ySlices.forEach(function (slice) {
        ySlicesObj.add(slice);
    });

    var curvesObj = new THREE.Object3D();
    curves.forEach(function (curve) {
        curvesObj.add(curve);
    });

    world.add(xSlicesObj);
    world.add(ySlicesObj);
    world.add(surface);
    world.add(curvesObj);

    surface.visible = false;
    xSlicesObj.visible = false;
    ySlicesObj.visible = true;
    curvesObj.visible = true;

    window.surface = surface;
    window.curves = curvesObj;
    window.xSlices = xSlicesObj;
    window.ySlices = ySlicesObj;

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
