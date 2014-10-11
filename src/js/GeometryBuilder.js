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

    function buildCurve(yMin, yMax, count) {
        var geometry = new THREE.Geometry();
        var y1 = yMin;
        var x1 = 1.0;
        var yStep = (yMax - yMin) / count;
        var j;
        var index = 0;

        for (j = 0; j < count; j++, index += 5) {
            var y2 = y1 + yStep;

            geometry.vertices.push(new THREE.Vector3(x1,y1,0));

            y1 = y2;
        }
        geometry.vertices.push(new THREE.Vector3(x1,y1,0));

        return geometry;
    }

    return {
        buildGrid: buildGrid,
        buildCurve: buildCurve
    };
});
