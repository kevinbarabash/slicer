/**
 * Created by kevin on 2014-10-09.
 */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x333333);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// TODO: switch to orthographic camera
// TODO: expose more uniforms, e.g. opacity
// TODO: add sliders to uniforms
// TODO: add axes and a grid on the xy plane
// TODO: equilateral triangle grid
// TODO: automatic subdivision to model details
// TODO: move the computation of the z-coordinates into the vertex shader

function gauss(x,y) {
    return Math.pow(Math.E, -(x*x + y*y));
}

function waves(x,y) {
    return (Math.cos(5 * x * y)) / 5;
}

var grid = [];
var count = 64;

var xMin = -2;
var xMax = 2;
var yMin = 0;
var yMax = 2;
var xStep = (xMax - xMin) / count;
var yStep = (yMax - yMin) / count;

var x = xMin;
for (var i = 0; i < count + 1; i++, x += xStep) {
    grid[i] = [];
    var y = yMin;
    for (var j = 0; j < count + 1; j++, y += yStep) {
        var z = waves(x,y);
        grid[i][j] = new THREE.Vector3(x, y, z);
    }
}

var geometry = new THREE.Geometry();

var index = 0;
for (var i = 0; i < count; i++) {
    for (var j = 0; j < count; j++) {
        var p1 = grid[i][j];
        var p2 = grid[i+1][j];
        var p3 = grid[i+1][j+1];
        var p4 = grid[i][j+1];

        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        geometry.vertices.push(p3);
        geometry.vertices.push(p4);

        // puts the diagonal bias in the other direction
//      geometry.faces.push(new THREE.Face3(index + 0, index + 1, index + 2));
//      geometry.faces.push(new THREE.Face3(index + 2, index + 3, index + 0));

        geometry.faces.push(new THREE.Face3(index + 0, index + 1, index + 3));
        geometry.faces.push(new THREE.Face3(index + 1, index + 2, index + 3));

        index += 4;
    }
}

geometry.mergeVertices();
geometry.computeFaceNormals();
geometry.computeVertexNormals();


var vertexShader =
    "varying vec3 vNormal;\n" +
    "varying vec3 vPosition;\n" +
    "varying mat3 vNormalMatrix;\n" +
    "\n" +
    "void main(void) {\n" +
    "  vNormal = normalize(normalMatrix * normal);\n" +
    "  vPosition = position;\n" +
    "  vNormalMatrix = normalMatrix;\n" +
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n" +
    "}";

var fragmentShader =
    "precision mediump float;\n" +
    "varying vec3 vNormal;\n" +
    "varying vec3 vPosition;\n" +
    "varying mat3 vNormalMatrix;\n" +
    "uniform vec3 uColor;\n" +
    "\n";

fragmentShader +=
//      "float func(float x, float y) {\n" +
//      "  return exp(-(x * x + y * y));\n" +
//      "}\n" +
    "float func(float x, float y) {\n" +
    "  return cos(5.0 * x * y) / 5.0;\n" +
    "}\n" +
    "\n";

fragmentShader +=
    "void main(void) {\n" +
    "  vec3 light = vec3(0.0, 0.0, 1.0);\n" +
    "  float x1 = vPosition.x;\n" +
    "  float y1 = vPosition.y;\n" +
    "  float d = 0.0001;\n" +
    "  float x2 = x1 + d;\n" +
    "  float y2 = y1 + d;\n" +
    "  vec3 v1 = vec3(x2, y1, func(x2, y1)) - vec3(x1, y1, func(x1, y1));\n" +
    "  vec3 v2 = vec3(x1, y2, func(x1, y2)) - vec3(x1, y1, func(x1, y1));\n" +
    "  vec3 n = normalize(vNormalMatrix * cross(v1, v2));\n" +
    "  float alpha = 0.2 + 0.7 * ( 1.0 - abs(dot(n, light)) );\n" +
    "  gl_FragColor = vec4(uColor, alpha);\n" +
    "}";

var attributes = {};
var uniforms = {
    uColor: {
        type: 'v3',
        value: new THREE.Vector3(1.0, 1.0, 0.0)
    }
};

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    attributes: attributes,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false
});

var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 3;

var directionalLight = new THREE.DirectionalLight(0xc0c0c0);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

var ambient = new THREE.AmbientLight( 0x101010 );
scene.add( ambient );

var render = function () {
    requestAnimationFrame(render, renderer.domElement);
    renderer.render(scene, camera);
};

controls = new THREE.OrbitControls(camera, renderer.domElement);

render();
