/*global THREE */

define(function () {
    THREE.GimbalFreeOrbitControls = function (object, domElement) {

        this.object = object;
        this.domElement = ( domElement !== undefined ) ? domElement : document;

        var scope = this;

        var rotWorldMatrix;
        // Rotate an object around an arbitrary axis in world space
        function rotateAroundWorldAxis(object, axis, radians) {
            rotWorldMatrix = new THREE.Matrix4();
            rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

            // old code for Three.JS pre r54:
            //  rotWorldMatrix.multiply(object.matrix);
            // new code for Three.JS r55+:
            rotWorldMatrix.multiply(object.matrix);                // pre-multiply

            object.matrix = rotWorldMatrix;

            // old code for Three.js pre r49:
            // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
            // new code for Three.js r50+:
            object.rotation.setFromRotationMatrix(object.matrix);
        }

        var lastX, lastY, down;

        this.domElement.addEventListener("mousedown", function (e) {
            lastX = e.pageX;
            lastY = e.pageY;
            down = true;
        });

        document.addEventListener("mousemove", function (e) {
            if (down) {
                var dx = e.pageX - lastX;
                var dy = e.pageY - lastY;
                var d = Math.sqrt(dx*dx + dy*dy);

                if (dx === 0 && dy === 0) {
                    return;
                }

                var axis = new THREE.Vector3(dy/d, dx/d, 0);
                rotateAroundWorldAxis(object, axis, d / 200);

                lastX = e.pageX;
                lastY = e.pageY;

                scope.update();
            }
        });

        document.addEventListener("mouseup", function (e) {
            if (down) {
                down = false;
            }
        });

        this.update = function () {
            this.dispatchEvent({ type: 'change' });
        };
    };

    THREE.GimbalFreeOrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
});
