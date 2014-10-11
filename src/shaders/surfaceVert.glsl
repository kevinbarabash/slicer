varying vec3 vPosition;
varying mat3 vNormalMatrix;

// FUNC

void main(void) {
    vPosition = position;
    vPosition.z = func(vPosition.x, vPosition.y);
    vNormalMatrix = normalMatrix;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition,1.0);
}
