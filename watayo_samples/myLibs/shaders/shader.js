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

// export const lineFrag =
//     `
// #ifdef GL_ES
// precision mediump float;
// #endif

// #define PI 3.14159265359

// uniform float time;
// uniform vec2 resolution;


// varying vec2 vUv;
// varying vec3 vNormal;

// float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
//     return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
// }

// mat2 rotate2d(float angle){
//     return mat2(cos(angle), -sin(angle),  sin(angle), cos(angle));
// }

// float obliqueLine(vec2 uv){
//     return step(0.6, fract((uv.x + uv.y + time * 0.8) * 2.0));
// }

// void main( void ) {
//     vec2 uv = 2.0 * vUv - 1.0;



//     gl_FragColor = vec4(color, 1.0);
// }
//  `

// export const wave = `
// #ifdef GL_ES
// precision mediump float;
// #endif

// #define PI 3.141592653589793
// #define TWO_PI 6.283

// uniform vec2 resolution;
// uniform float time;

// uniform vec3 dirLightPos;
// uniform vec3 dirLightColor;
// uniform vec3 pointLightPos;
// uniform vec3 pointLightColor;


// varying vec2 vUv;
// varying vec3 vNormal;

// vec2 directionalWaveNormal(vec2 uv, float amp, vec2 dir, float freq, float speed, float k) {
//     float a = dot(uv, dir) * freq + time * speed;
//     float b = 7.5 * k * freq * amp * pow((sin(a) + 1.0) * 0.5, k - 1.0) * cos(a);
//     return vec2(dir.x * b, dir.y * b);
// }

// vec3 summedWaveNormal(vec2 uv) {
//     vec2 sum = vec2(0.0);
//     sum += directionalWaveNormal(uv, 0.5, normalize(vec2(1.0, 1.0)), 5.0, 1.5, 1.0);
//     sum += directionalWaveNormal(uv, 0.25,normalize(vec2(1.4, 1.0)), 11.0, 2.5, 1.5);
//     sum += directionalWaveNormal(uv, 0.125, normalize(vec2(-0.8, -1.0)), 10.0, 3.0, 2.0);
//     sum += directionalWaveNormal(uv, 0.0625, normalize(vec2(1.3, 1.0)), 15.0, 4.0, 2.0);
//     sum += directionalWaveNormal(uv, 0.03125, normalize(vec2(-1.7, -1.0)), 5.0, 1.0, 3.0);
//     return normalize(vec3(-sum.x, -sum.y, 1.0));
// }

// void main( void ) {
//     vec2 uv = 2.0 * vUv - 1.0;

//     float directionalLightWeighting = max(dot(normalize(vNormal), dirLightPos), 0.0);
//     vec3 lightWeighting = max(dot(normalize(vNormal), pointLightPos), 0.0) + dirLightColor * directionalLightWeighting;

//     vec3 normal = summedWaveNormal(uv * 5.0);

//     vec3 color = mix(vec3(0.0, 5.0, 5.0), vec3(0.2, 1.0, 1.0), dot(normal, normalize(vec3(0.2, 0.2, 0.5))) * 0.5);
//     color = mix(color, vec3(0.9, 0.9, 2.0), pow(dot(normal, normalize(vec3(-2.0, -9.0, 0.5))) * 1.5 + 0.5, 1.0));

//     vec3 shadowColor = vec3(0.0, 1.0, 1.0);
//     color = mix(color, shadowColor, directionalLightWeighting);

//     gl_FragColor = vec4(color, 1.0);
// }
// `