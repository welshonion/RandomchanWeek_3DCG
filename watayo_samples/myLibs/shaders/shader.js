// vertex shader
export const basicVert =
  `
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vNormal = normalize(normalMatrix * normal);
}
  `

export const basicFrag =
  `

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float time;
uniform vec2 resolution;

uniform vec3 dirLightPos;
uniform vec3 dirLightColor;
uniform vec3 pointLightPos;
uniform vec3 pointLightColor;

varying vec2 vUv;
varying vec3 vNormal;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
    return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main( void ) {
    vec2 pos = 2.0 * vUv - 1.0;

    float directionalLightWeighting = max(dot(normalize(vNormal), dirLightPos), 0.0);

    vec3 lightWeighting = max(dot(normalize(vNormal), pointLightPos), 0.0) + dirLightColor * directionalLightWeighting;

//    float intensity = smoothstep(0.0, 1.0, pow(length(lightWeighting), 20.0));

    uv *= 6.0;
    uv = fract(uv);
    uv -= 0.5;

    vec3 ballColor = vec3(1.0, 0.0, 0.5);
    vec3 shadowColor = vec3(0.0, 1.0, 1.0);
    vec3 color = mix(ballColor, shadowColor, directionalLightWeighting);

    color -= 0.3 + 0.2 * abs(sin(time * 2.0)) / length(uv);

    gl_FragColor = texture2D(color, pos);

}
  `

export const lineFrag =
  `
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float time;
uniform vec2 resolution;

uniform vec3 dirLightPos;
uniform vec3 dirLightColor;
uniform vec3 pointLightPos;
uniform vec3 pointLightColor;

varying vec2 vUv;
varying vec3 vNormal;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
    return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),  sin(angle), cos(angle));
}

float obliqueLine(vec2 uv){
    return step(0.6, fract((uv.x + uv.y + time * 0.8) * 1.0));
}

void main( void ) {

  vec2 pos = gl_TexCoord.xy;
  vec3 color = vec3(0.0);
	float line = obliqueLine(pos * 14.0);
	color += vec3(line);
	gl_FragColor = vec4(color, 1.0);

}
 `