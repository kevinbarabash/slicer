precision mediump float;

varying vec3 vPosition;
varying mat3 vNormalMatrix;
uniform vec3 uColor;

// FUNC

void main(void) {
    vec3 light = vec3(0.0, 0.0, 1.0);
    float d = 0.001;

    float x1 = vPosition.x;
    float y1 = vPosition.y;
    float x2 = x1 + d;
    float y2 = y1 + d;

    vec3 v1 = vec3(x2, y1, func(x2, y1)) - vec3(x1, y1, func(x1, y1));
    vec3 v2 = vec3(x1, y2, func(x1, y2)) - vec3(x1, y1, func(x1, y1));

    vec3 n = normalize(vNormalMatrix * cross(v1, v2));

    float alpha = 0.2 + 0.7 * ( 1.0 - abs(dot(n, light)) );
    gl_FragColor = vec4(uColor, alpha);
}
