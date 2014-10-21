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

    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    var pCamera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.1, 1000);
    pCamera.position.z = 3;

    var camera = pCamera;

    var antialias = true;
    var renderer = new THREE.WebGLRenderer({ antialias: antialias });
    window.renderer = renderer;
    renderer.setClearColor(0x333333);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var xMin = 0.0;
    var xMax = 2.0;
    var yMin = -2.0;
    var yMax = 2.0;

    var func = funcs.gauss;
    var count = 32;
    var i, x, y;

    var curves = [];
    for (i = -2.0; i < 2.0; i += 0.25) {
        curves.push(ObjectBuilder.buildCurve(func, i));
    }

    var xSlices = [];
    var xCount = count;
    var xStep = (xMax - xMin) / xCount;
    for (i = 0, x = xMin; i <= xCount; i++) {
        xSlices.push(ObjectBuilder.buildXSlice(yMin, yMax, func, x));
        x += xStep
    }

    var ySlices = [];
    var yCount = count;
    var yStep = (yMax - yMin) / yCount;
    for (i = 0, y = yMin; i <= yCount; i++) {
        ySlices.push(ObjectBuilder.buildYSlice(xMin, xMax, func, y));
        y += yStep;
    }

    var surface = ObjectBuilder.buildSurface(func, xMin, xMax, yMin, yMax);

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
        if (settings) {
            settings.rotation_x = world.rotation.x;
            settings.rotation_z = world.rotation.z;
        }
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

    var surfaceVertexShader = require('text!shaders/surfaceVert.glsl');
    var gerateVertexShader = function (func) {
        return surfaceVertexShader.replace('// FUNC', func);
    };

    var surfaceFragmentShader = require('text!shaders/surfaceFrag.glsl');
    var generateFragementShader = function (func) {
        return surfaceFragmentShader.replace('// FUNC', func);
    };

    function updateWorld(settings) {
        var surfaceVisible = surface.visible;
        var xSlicesVisible = xSlicesObj.visible;
        var ySlicesVisible = ySlicesObj.visible;
        var curvesVisible = curvesObj.visible;

        // TODO: iterate over children to remove all
        world.remove(surface);
        world.remove(xSlicesObj);
        world.remove(ySlicesObj);
        world.remove(curvesObj);

        var i;

        var curves = [];
        for (i = -2.0; i < 2.0; i += 0.25) {
            curves.push(ObjectBuilder.buildCurve(func, i));
        }

        var xSlices = [];
        var xCount = count;
        var xStep = (xMax - xMin) / xCount;
        for (i = 0, x = xMin; i <= xCount; i++) {
            xSlices.push(ObjectBuilder.buildXSlice(yMin, yMax, func, x));
            x += xStep
        }

        var ySlices = [];
        var yCount = count;
        var yStep = (yMax - yMin) / yCount;
        for (i = 0, y = yMin; i <= yCount; i++) {
            ySlices.push(ObjectBuilder.buildYSlice(xMin, xMax, func, y));
            y += yStep;
        }

        surface = ObjectBuilder.buildSurface(func, xMin, xMax, yMin, yMax);

        surface.material.vertexShader = gerateVertexShader(func);
        surface.material.needsUpdate = true;
        surface.material.fragmentShader = generateFragementShader(func);
        surface.material.needsUpdate = true;

        xSlicesObj = new THREE.Object3D();
        xSlices.forEach(function (slice) {
            xSlicesObj.add(slice);
        });

        ySlicesObj = new THREE.Object3D();
        ySlices.forEach(function (slice) {
            ySlicesObj.add(slice);
        });

        curvesObj = new THREE.Object3D();
        curves.forEach(function (curve) {
            curvesObj.add(curve);
        });

        surface.visible = surfaceVisible;
        xSlicesObj.visible = xSlicesVisible;
        ySlicesObj.visible = ySlicesVisible;
        curvesObj.visible = curvesVisible;

        world.add(xSlicesObj);
        world.add(ySlicesObj);
        world.add(surface);
        world.add(curvesObj);
    }

    Object.defineProperty(settings, "function", {
        get: function () {
            if (func === funcs.gauss) {
                return "gauss";
            } else if (func === funcs.waves) {
                return "waves";
            }
        },
        set: function (value) {
            if (value === "gauss") {
                func = funcs.gauss;
            } else if (value === "waves") {
                func = funcs.waves;
            }

            updateWorld(settings);
        }
    });

    Object.defineProperty(settings, "xMax", {
        get: function () {
            return xMax;
        },
        set: function (value) {
            xMax = value;
            surface.material.uniforms.uXMax.value = xMax;
            surface.material.uniforms.uXMax.needsUpdate = true;
        }
    });

    Object.defineProperty(settings, "yMax", {
        get: function () {
            return yMax;
        },
        set: function (value) {
            yMax = value;
            surface.material.uniforms.uYMax.value = yMax;
            surface.material.uniforms.uYMax.needsUpdate = true;
        }
    });

    Object.defineProperty(settings, "xMin", {
        get: function () {
            return xMin;
        },
        set: function (value) {
            xMin = value;
            surface.material.uniforms.uXMin.value = xMin;
            surface.material.uniforms.uXMin.needsUpdate = true;
        }
    });

    Object.defineProperty(settings, "yMin", {
        get: function () {
            return yMin;
        },
        set: function (value) {
            yMin = value;
            surface.material.uniforms.uYMin.value = yMin;
            surface.material.uniforms.uYMin.needsUpdate = true;
        }
    });

    Object.defineProperty(settings, "color", {
        get: function () {
            var vec = surface.material.uniforms.uColor.value;
            return [255 * vec.x | 0, 255 * vec.y | 0, 255 * vec.z | 0];
        },
        set: function (value) {
            surface.material.uniforms.uColor.value = new THREE.Vector3(value[0]/255, value[1]/255, value[2]/255);
            surface.material.needsUpdate = true;
        }
    });

    Object.defineProperty(settings, "solid", {
        get: function () {
            return surface.material.uniforms.uSolid.value;
        },
        set: function (value) {
            surface.material.uniforms.uSolid.value = value;
            surface.material.depthTest = value;
            surface.material.depthWrite = value;
            surface.material.needsUpdate = true;
        }
    });

    settings.fullscreen = function () {
        var elem = document.body;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    };

    var gui = new dat.GUI();

    gui.add(settings, "fullscreen");

    gui.add(settings, "surface");
    gui.add(settings, "solid");
    gui.addColor(settings, "color", [255,255,0]);
    gui.add(settings, "xMax", 0, 2).listen();
    gui.add(settings, "yMax", 0, 2);
    gui.add(settings, "xMin", -2, 0);
    gui.add(settings, "yMin", -2, 0);

    gui.add(settings, "curves");
    gui.add(settings, "xSlices");
    gui.add(settings, "ySlices");

    gui.add(settings, "function", [ "gauss", "waves" ]);

    gui.add(settings, "rotation_x", -Math.PI, 0).listen();
    gui.add(settings, "rotation_z", -3*Math.PI/2, Math.PI/2).listen();

    gui.add(settings, 'camera', [ 'orthographic', 'perspective' ] );

    gui.add(settings, "axes");
    gui.add(settings, "grid");

    gui.add(settings, 'reset');

    window.gui = gui;
    window.settings = settings;
});
