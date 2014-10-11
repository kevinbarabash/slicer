/*global THREE, define */

define(function (require) {
    require('GimbalFreeOrbitControls');

    var scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    var height = 4.5;
    var width = 4.5 * aspectRatio;

    var camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 100);
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    var antialias = false;
    var renderer = new THREE.WebGLRenderer({ antialias: antialias });
    renderer.setClearColor(0x333333);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // TODO: expose more uniforms, e.g. opacity
    // TODO: add sliders to uniforms
    // TODO: ability to switch between semi-transparent and solid
    // TODO: proper shading with light source for solid
    // TODO: ability to chnage graphing functions on the fly

    var Builder = require('GeometryBuilder');

    var surfaceGeometry = Builder.buildGrid(-2, 2, -2, 2, 128);
    var curveGeometry = Builder.buildCurve(-2, 2, 182);

    var waves = "float func(float x, float y) {\n" +
        "  return cos(5.0 * x * y) / 5.0;\n" +
        "}";

    var gauss = "float func(float x, float y) {\n" +
        "  return exp(-(x * x + y * y));\n" +
        "}";

    var surfaceVertexShader = require('text!shaders/surfaceVert.glsl');
    var gerateVertexShader = function (func) {
        return surfaceVertexShader.replace('// FUNC', func);
    };

    var surfaceFragmentShader = require('text!shaders/surfaceFrag.glsl');
    var generateFragementShader = function (func) {
        return surfaceFragmentShader.replace('// FUNC', func);
    };

    var lineFragmentShader = require('text!shaders/lineFrag.glsl');
    var lineVertexShader = require('text!shaders/lineVert.glsl');
    var generateLineVertexShader = function (func) {
        return lineVertexShader.replace('// FUNC', func);
    };

    var func = gauss;

    var material = new THREE.ShaderMaterial({
        attributes: {},
        uniforms: {
            uColor: {
                type: 'v3',
                value: new THREE.Vector3(1.0, 1.0, 0.0)
            }
        },
        vertexShader: gerateVertexShader(func),
        fragmentShader: generateFragementShader(func),
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false
    });

    var sliceMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uColor: {
                type: 'v3',
                value: new THREE.Vector3(1.0, 0.0, 0.0)
            }
        },
        attributes: {},
        vertexShader: generateLineVertexShader(func),
        fragmentShader: lineFragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });

    var curve = new THREE.Line(curveGeometry, sliceMaterial);
    var surface = new THREE.Mesh(surfaceGeometry, material);

    var world = new THREE.Object3D();
    world.add(surface);
    world.add(curve);
    scene.add(world);

    camera.position.z = 3;

    var directionalLight = new THREE.DirectionalLight(0xc0c0c0);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    var ambient = new THREE.AmbientLight( 0x101010 );
    scene.add( ambient );

    var animate = function () {
        requestAnimationFrame(animate, renderer.domElement);
        controls.update();
    };

    var render = function () {
        renderer.render(scene, camera);
    };

    world.rotation.x = -Math.PI / 2.4;
    world.rotation.z = -Math.PI / 1.6;
    //world.rotation.x = -1;
    //world.rotation.z = -2;

    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });

    var line;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(4, 0, 0));
    line = new THREE.Line(geometry, lineMaterial);
    world.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 4, 0));
    line = new THREE.Line(geometry, lineMaterial);
    world.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 4));
    line = new THREE.Line(geometry, lineMaterial);
    world.add(line);

    //var controls = new THREE.OrbitControls(camera, renderer.domElement);
    var controls = new THREE.GimbalFreeOrbitControls(world, renderer.domElement);
    controls.addEventListener('change', render);

    render();
    animate();
});
