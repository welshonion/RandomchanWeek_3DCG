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

float obliqueLine(vec2 pos, float v){
    return step(v, fract((pos.x + pos.y + time * 0.8) * 3.0));
}

float obliqueSmoothLine(vec2 pos, float b, float e) {
    return smoothstep(b, e, fract((pos.x + pos.y + time * 0.8)*3.0)) - smoothstep(e, e + e - b, fract((pos.x + pos.y + time * 0.8)*3.0));
}
void main() {

    float directionalLightWeighting = max(dot(normalize(vNormal), dirLightPos), 0.0);
    vec3 lightWeighting = max(dot(normalize(vNormal), pointLightPos), 0.0) * pointLightColor + dirLightColor * directionalLightWeighting;

    vec3 ballColor = vec3(0.50,0.60, 1.0);
    vec3 shadowColor = vec3(0.3, 0.6, 0.8);
    vec3 color = mix(ballColor, shadowColor, directionalLightWeighting);
    // color +=  vec3(obliqueLine(vNormal.xz, 0.5));
    color += vec3(obliqueSmoothLine(vNormal.xz, 0.0, 0.4));

    gl_FragColor = vec4(color, 1.0 );
}
    `

export const tileFrag = 
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

float obliqueLine(vec2 pos, float v){
    return step(v, fract((pos.x + pos.y + time * 0.8) * 3.0));
}

float obliqueSmoothLine(vec2 pos, float b, float e) {
    return smoothstep(b, e, fract((pos.x + pos.y + time * 0.8)*3.0)) - smoothstep(e, e + e - b, fract((pos.x + pos.y + time * 0.8)*3.0));
}
void main() {

    float directionalLightWeighting = max(dot(normalize(vNormal), dirLightPos), 0.0);
    vec3 lightWeighting = max(dot(normalize(vNormal), pointLightPos), 0.0) * pointLightColor + dirLightColor * directionalLightWeighting;

    vec3 ballColor = vec3(0.50,0.60, 1.0);
    vec3 shadowColor = vec3(0.3, 0.6, 0.8);
    vec3 color = mix(ballColor, shadowColor, directionalLightWeighting);
    // color +=  vec3(obliqueLine(vNormal.xz, 0.5));
    color += vec3(obliqueSmoothLine(vNormal.xz, 0.0, 0.4));

    gl_FragColor = vec4(color, 1.0 );
}


`

export const glitchFrag = 
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

float obliqueLine(vec2 pos, float v){
    return step(v, fract((pos.x + pos.y + time * 0.8) * 3.0));
}

float obliqueSmoothLine(vec2 pos, float b, float e) {
    return smoothstep(b, e, fract((pos.x + pos.y + time * 0.8)*3.0)) - smoothstep(e, e + e - b, fract((pos.x + pos.y + time * 0.8)*3.0));
}
void main() {

    float directionalLightWeighting = max(dot(normalize(vNormal), dirLightPos), 0.0);
    vec3 lightWeighting = max(dot(normalize(vNormal), pointLightPos), 0.0) * pointLightColor + dirLightColor * directionalLightWeighting;

    vec3 ballColor = vec3(0.50,0.60, 1.0);
    vec3 shadowColor = vec3(0.3, 0.6, 0.8);
    vec3 color = mix(ballColor, shadowColor, directionalLightWeighting);
    // color +=  vec3(obliqueLine(vNormal.xz, 0.5));
    color += vec3(obliqueSmoothLine(vNormal.xz, 0.0, 0.4));

    gl_FragColor = vec4(color, 1.0 );
}


`


