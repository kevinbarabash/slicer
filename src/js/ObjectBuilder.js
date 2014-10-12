/*global THREE, define */

define(function (require) {

    var GeometryBuilder = require('GeometryBuilder');

    var surfaceVertexShader = require('text!shaders/surfaceVert.glsl');
    var gerateVertexShader = function (func) {
        return surfaceVertexShader.replace('// FUNC', func);
    };

    var surfaceFragmentShader = require('text!shaders/surfaceFrag.glsl');
    var generateFragementShader = function (func) {
        return surfaceFragmentShader.replace('// FUNC', func);
    };

    function buildSurface(func) {
        var geometry = GeometryBuilder.buildGrid(-2, 2, -2, 2, 128);
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

        return new THREE.Mesh(geometry, material);
    }

    var lineFragmentShader = require('text!shaders/lineFrag.glsl');
    var lineVertexShader = require('text!shaders/lineVert.glsl');
    var generateLineVertexShader = function (func) {
        return lineVertexShader.replace('// FUNC', func);
    };

    function buildCurve(func, xPos) {
        var geometry = GeometryBuilder.buildCurve(-2, 2, 128, xPos);
        var material = new THREE.ShaderMaterial({
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

        return new THREE.Line(geometry, material);
    }

    var sliceFragmentShader = require('text!shaders/sliceFrag.glsl');
    var sliceVertexShader = require('text!shaders/sliceVert.glsl');

    function buildXSlice(yMin, yMax, func, xPos) {
        var geometry = GeometryBuilder.buildXSlice(yMin, yMax, 128, xPos);
        var material = new THREE.ShaderMaterial({
            uniforms: {
                uColor: {
                    type: 'v3',
                    value: new THREE.Vector3(0.0, 1.0, 1.0)
                }
            },
            attributes: {},
            vertexShader: sliceVertexShader.replace('// FUNC', func),
            fragmentShader: sliceFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false
        });

        return new THREE.Mesh(geometry, material);
    }

    function buildYSlice(xMin, xMax, func, yPos) {
        var geometry = GeometryBuilder.buildYSlice(xMin, xMax, 128, yPos);
        var material = new THREE.ShaderMaterial({
            uniforms: {
                uColor: {
                    type: 'v3',
                    value: new THREE.Vector3(0.0, 1.0, 1.0)
                }
            },
            attributes: {},
            vertexShader: sliceVertexShader.replace('// FUNC', func),
            fragmentShader: sliceFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false
        });

        return new THREE.Mesh(geometry, material);
    }

    function buildAxes() {
        var axes = new THREE.Object3D();

        var lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });

        var line;
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(4, 0, 0));
        line = new THREE.Line(geometry, lineMaterial);
        axes.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, 4, 0));
        line = new THREE.Line(geometry, lineMaterial);
        axes.add(line);

        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, 0, 4));
        line = new THREE.Line(geometry, lineMaterial);
        axes.add(line);

        return axes;
    }

    function buildGrid() {
        var grid = new THREE.Object3D();

        var lineMaterial = new THREE.LineBasicMaterial({
            color: 0x666666
        });

        var geometry;
        for (var i = 0; i <= 3; i += 0.25) {
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(i, 0, 0));
            geometry.vertices.push(new THREE.Vector3(i, 3, 0));
            grid.add(new THREE.Line(geometry, lineMaterial));

            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, i, 0));
            geometry.vertices.push(new THREE.Vector3(3, i, 0));
            grid.add(new THREE.Line(geometry, lineMaterial));
        }

        return grid;
    }

    return {
        buildCurve: buildCurve,
        buildXSlice: buildXSlice,
        buildYSlice: buildYSlice,
        buildSurface: buildSurface,
        buildAxes: buildAxes,
        buildGrid: buildGrid
    };
});
