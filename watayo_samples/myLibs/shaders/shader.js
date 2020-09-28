// vertex shader
export const basicVert =
    `
precision mediump float;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
}
    `

export const basicFrag =
    `
precision mediump float;
uniform float time;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 );
}
    `


export const lineFrag =
    `
precision mediump float;

uniform float time;

uniform vec3 dirLightPos;
uniform vec3 dirLightColor;
uniform vec3 pointLightPos;
uniform vec3 pointLightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float obliqueLine(vec2 pos){
    return step(0.6, fract((pos.x + pos.y + time * 0.8) * 9.0));
}

void main() {

    float directionalLightWeighting = max(dot(normalize(vNormal), dirLightPos), 0.0);
    vec3 lightWeighting = max(dot(normalize(vNormal), pointLightPos), 0.0) * pointLightColor + dirLightColor * directionalLightWeighting;

    vec3 ballColor = vec3(0.139,0.000,0.426);
    vec3 shadowColor = vec3(0.0, 1.0, 1.0);
    vec3 color = mix(ballColor, shadowColor, directionalLightWeighting);
    color +=  vec3(obliqueLine(vPosition.xy));

    gl_FragColor = vec4(color, 1.0 );
}
    `
