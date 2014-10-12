/*global THREE */

define(function () {

    function buildGrid(xMin, xMax, yMin, yMax, count) {
        var xStep = (xMax - xMin) / count;
        var yStep = (yMax - yMin) / count;
        var geometry = new THREE.Geometry();
        var x1, x2, y1, y2;
        var i, j;
        var index = 0;

        x1 = xMin;
        for (i = 0; i < count; i++) {
            x2 = x1 + xStep;
            y1 = yMin;
            for (j = 0; j < count; j++, index += 5) {
                y2 = y1 + yStep;

                // TODO: don't repeat vertices
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
        return geometry;
    }

    function buildCurve(yMin, yMax, count, xPos) {
        var geometry = new THREE.Geometry();
        var y1 = yMin;
        var x1 = xPos;
        var yStep = (yMax - yMin) / count;

        for (var i = 0; i < count; i++) {
            geometry.vertices.push(new THREE.Vector3(x1,y1,0));
            y1 += yStep;
        }
        geometry.vertices.push(new THREE.Vector3(x1,y1,0));

        return geometry;
    }

    function buildXSlice(yMin, yMax, count, xPos) {
        var geometry = new THREE.Geometry();
        var yStep = (yMax - yMin) / count;

        var y1 = yMin;
        var z1 = 0.0;

        var z2 = 1.0;
        var index = 0;

        for (var i = 0; i < count; i++, index += 4) {
            var y2 = y1 + yStep;

            // TODO: don't repeat vertices
            geometry.vertices.push(new THREE.Vector3(xPos,y1,z1));
            geometry.vertices.push(new THREE.Vector3(xPos,y2,z1));
            geometry.vertices.push(new THREE.Vector3(xPos,y2,z2));
            geometry.vertices.push(new THREE.Vector3(xPos,y1,z2));

            geometry.faces.push(new THREE.Face3(index + 0, index + 1, index + 2));
            geometry.faces.push(new THREE.Face3(index + 0, index + 2, index + 3));

            y1 = y2;
        }

        return geometry;
    }

    function buildYSlice(xMin, xMax, count, yPos) {
        var geometry = new THREE.Geometry();
        var xStep = (xMax - xMin) / count;

        var x1 = xMin;
        var z1 = 0.0;

        var z2 = 1.0;
        var index = 0;

        for (var i = 0; i < count; i++, index += 4) {
            var x2 = x1 + xStep;

            // TODO: don't repeat vertices
            geometry.vertices.push(new THREE.Vector3(x1,yPos,z1));
            geometry.vertices.push(new THREE.Vector3(x2,yPos,z1));
            geometry.vertices.push(new THREE.Vector3(x2,yPos,z2));
            geometry.vertices.push(new THREE.Vector3(x1,yPos,z2));

            geometry.faces.push(new THREE.Face3(index + 0, index + 1, index + 2));
            geometry.faces.push(new THREE.Face3(index + 0, index + 2, index + 3));

            x1 = x2;
        }

        return geometry;
    }

    return {
        buildGrid: buildGrid,
        buildCurve: buildCurve,
        buildXSlice: buildXSlice,
        buildYSlice: buildYSlice
    };
});
