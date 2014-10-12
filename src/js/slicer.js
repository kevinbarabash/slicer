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
    var orthoCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 100);
    orthoCamera.position.z = 3;

    var pCamera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.1, 1000);
    pCamera.position.z = 3;

    var camera = pCamera;

    var antialias = false;
    var renderer = new THREE.WebGLRenderer({ antialias: antialias });
    window.renderer = renderer;
    renderer.setClearColor(0x333333);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var xMin = -2.0;
    var xMax = 2.0;
    var yMin = -2.0;
    var yMax = 2.0;

    var func = funcs.gauss;
    var count = 32;

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

    surface.visible = true;
    xSlicesObj.visible = false;
    ySlicesObj.visible = false;
    curvesObj.visible = false;

    window.surface = surface;
    window.curves = curvesObj;
    window.xSlices = xSlicesObj;
    window.ySlices = ySlicesObj;

    var axes = ObjectBuilder.buildAxes();
    var grid = ObjectBuilder.buildGrid();

    world.add(axes);
    world.add(grid);

    world.rotation.x = -Math.PI / 2.4;
    world.rotation.z = -Math.PI / 1.6;

    world.position.z = -5;

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

    var settings = {
        reset: function () {
            world.rotation.x = -Math.PI / 2.4;
            world.rotation.y = 0;
            world.rotation.z = -Math.PI / 1.6;
            camera = pCamera;
        }
    };

    Object.defineProperty(settings, "surface", {
        get: function () {
            return surface.visible;
        },
        set: function (value) {
            surface.visible = value;
        }
    });

    Object.defineProperty(settings, "curves", {
        get: function () {
            return curvesObj.visible;
        },
        set: function (value) {
            curvesObj.visible = value;
        }
    });

    Object.defineProperty(settings, "xSlices", {
        get: function () {
            return xSlicesObj.visible;
        },
        set: function (value) {
            xSlicesObj.visible = value;
        }
    });

    Object.defineProperty(settings, "ySlices", {
        get: function () {
            return ySlicesObj.visible;
        },
        set: function (value) {
            ySlicesObj.visible = value;
        }
    });

    Object.defineProperty(settings, "rotation_x", {
        get: function () {
            return world.rotation.x;
        },
        set: function (value) {
            world.rotation.x = value;
        }
    });

    Object.defineProperty(settings, "rotation_z", {
        get: function () {
            return world.rotation.z;
        },
        set: function (value) {
            world.rotation.z = value;
        }
    });

    Object.defineProperty(settings, "camera", {
        get: function () {
            if (camera === pCamera) {
                return "perspective";
            } else if (camera == orthoCamera) {
                return "orthographic"
            }
        },
        set: function (value) {
            if (value === "perspective") {
                camera = pCamera;
            } else if (value === "orthographic") {
                camera = orthoCamera;
            }
        }
    });

    Object.defineProperty(settings, "axes", {
        get: function () {
            return axes.visible;
        },
        set: function (value) {
            axes.visible = value;
        }
    });

    Object.defineProperty(settings, "grid", {
        get: function () {
            return grid.visible;
        },
        set: function (value) {
            grid.visible = value;
        }
    });

    var gui = new dat.GUI();
    gui.add(settings, "surface");
    gui.add(settings, "curves");
    gui.add(settings, "xSlices");
    gui.add(settings, "ySlices");

    gui.add(settings, "rotation_x", -Math.PI, 0);
    gui.add(settings, "rotation_z", -3*Math.PI/2, Math.PI/2);

    gui.add(settings, 'camera', [ 'orthographic', 'perspective' ] );

    gui.add(settings, "axes");
    gui.add(settings, "grid");

    gui.add(settings, 'reset');
});
