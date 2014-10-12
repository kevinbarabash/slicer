// FUNC

void main(void) {
    vec3 pos = position;
    if (pos.z == 1.0) {
        pos.z = func(pos.x, pos.y);
    }
//    pos.z = func(pos.x, pos.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}
