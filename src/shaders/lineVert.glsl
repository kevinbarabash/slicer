// FUNC

void main(void) {
    vec3 pos = position;
    pos.z = func(pos.x, pos.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}
