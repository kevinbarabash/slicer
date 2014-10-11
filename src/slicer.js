/**
 * Created by kevin on 2014-10-09.
 */

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

// TODO: add slice line overlay
// TODO: expose more uniforms, e.g. opacity
// TODO: add sliders to uniforms
// TODO: ability to switch between semi-transparent and solid
// TODO: proper shading with light source for solid
// TODO: ability to chnage graphing functions on the fly

var count = 128;

var xMin = -2;
var xMax = 2;
var yMin = -2;
var yMax = 2;
var xStep = (xMax - xMin) / count;
var yStep = (yMax - yMin) / count;

var geometry = new THREE.Geometry();

var index = 0;
var x1, y1, x2, y2;
var i, j;

x1 = xMin;
for (i = 0; i < count; i++) {
    x2 = x1 + xStep;
    y1 = yMin;
    for (j = 0; j < count; j++, index += 5) {
        y2 = y1 + yStep;

        geometry.vertices.push(new THREE.Vector3(x1,y1,0));
        geometry.vertices.push(new THREE.Vector3(x2,y1,0));
        geometry.vertices.push(new THREE.Vector3(x2,y2,0));
        geometry.vertices.push(new THREE.Vector3(x1,y2,0));
        geometry.vertices.push(new THREE.Vector3((x1+x2)/2,(y1+y2)/2,0));

        geometry.faces.push(new THREE.Face3(index + 0, index + 1, index + 4));
        geometry.faces.push(new THREE.Face3(index + 1, index + 2, index + 4));
        geometry.faces.push(new THREE.Face3(index + 2, index + 3, index + 4));
        geometry.faces.push(new THREE.Face3(index + 3, index + 0, index + 4));

        y1 = y2;
    }
    x1 = x2;
}

var sliceGeometry = new THREE.Geometry();
y1 = yMin;
x1 = 1.0;
for (j = 0; j < count; j++, index += 5) {
    y2 = y1 + yStep;

    sliceGeometry.vertices.push(new THREE.Vector3(x1,y1,0));

    y1 = y2;
}
sliceGeometry.vertices.push(new THREE.Vector3(x1,y1,0));


var waves = "float func(float x, float y) {\n" +
    "  return cos(5.0 * x * y) / 5.0;\n" +
    "}\n";

var gauss = "float func(float x, float y) {\n" +
      "  return exp(-(x * x + y * y));\n" +
      "}\n";

var gerateVertexShader = function (func) {
    return "varying vec3 vNormal;\n" +
        "varying vec3 vPosition;\n" +
        "varying mat3 vNormalMatrix;\n" +
        "\n" + func + "\n" +
        "void main(void) {\n" +
        "  vNormal = normalize(normalMatrix * normal);\n" +
        "  vPosition = position;\n" +
        "  vPosition.z = func(vPosition.x, vPosition.y);\n" +
        "  vNormalMatrix = normalMatrix;\n" +
        "  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition,1.0);\n" +
        "}";
};

var generateFragementShader = function (func) {
    return "precision mediump float;\n" +
        "varying vec3 vNormal;\n" +
        "varying vec3 vPosition;\n" +
        "varying mat3 vNormalMatrix;\n" +
        "uniform vec3 uColor;\n" +
        "\n" + func + "\n" +
        "void main(void) {\n" +
        "  vec3 light = vec3(0.0, 0.0, 1.0);\n" +
        "  float x1 = vPosition.x;\n" +
        "  float y1 = vPosition.y;\n" +
        "  float d = 0.001;\n" +
        "  float x2 = x1 + d;\n" +
        "  float y2 = y1 + d;\n" +
        "  vec3 v1 = vec3(x2, y1, func(x2, y1)) - vec3(x1, y1, func(x1, y1));\n" +
        "  vec3 v2 = vec3(x1, y2, func(x1, y2)) - vec3(x1, y1, func(x1, y1));\n" +
        "  vec3 n = normalize(vNormalMatrix * cross(v1, v2));\n" +
        "  float alpha = 0.2 + 0.7 * ( 1.0 - abs(dot(n, light)) );\n" +
        "  gl_FragColor = vec4(uColor, alpha);\n" +
        "}";
};

var lineFragmentShader = "precision mediump float;\n" +
    "varying vec3 vNormal;\n" +
    "varying vec3 vPosition;\n" +
    "varying mat3 vNormalMatrix;\n" +
    "uniform vec3 uColor;\n" +
    "void main(void) {\n" +
    "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" +
    "}";


var attributes = {};
var uniforms = {
    uColor: {
        type: 'v3',
        value: new THREE.Vector3(1.0, 1.0, 0.0)
    }
};

var func = gauss;
//var func = waves;

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    attributes: attributes,
    vertexShader: gerateVertexShader(func),
    fragmentShader: generateFragementShader(func),
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false
//    wireframe: true
});


var lineMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff
});

var uniforms2 = {
    uColor: {
        type: 'v3',
        value: new THREE.Vector3(1.0, 0.0, 0.0)
    }
};
var sliceMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms2,
    attributes: attributes,
    vertexShader: gerateVertexShader(func),
    fragmentShader: lineFragmentShader,
    transparent: true,
    lineWidth: 2,
//    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false
});

var sliceLine = new THREE.Line(sliceGeometry, sliceMaterial);

var world = new THREE.Object3D();
var surface = new THREE.Mesh(geometry, material);
world.add(surface);
world.add(sliceLine);
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


var line;
geometry = new THREE.Geometry();
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

//surface.rotateY((60).toRadians());
//surface.rotateX((-45).toRadians());

//var controls = new THREE.OrbitControls(camera, renderer.domElement);
var controls = new THREE.GimbalFreeOrbitControls(world, renderer.domElement);
controls.addEventListener('change', render);

render();
animate();
