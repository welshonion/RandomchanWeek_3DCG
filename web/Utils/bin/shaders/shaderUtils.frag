// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float randomSerie(float x, float freq, float t) {
    return step(0.848,random( floor(x*freq)-floor(t) ));
}

vec2 truchetPattern(in vec2 _st, in float _index){
    _index = fract(((_index-0.5)*2.0));
    if (_index > 0.75) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0-_st.x,_st.y);
    } else if (_index > 0.25) {
        _st = 1.0-vec2(1.0-_st.x,_st.y);
    }
    return _st;
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

float box(in vec2 _st, in vec2 _size, in float _smoothEdge){
    _size = vec2(0.5) - _size*0.5;
    vec2 aa = vec2(_smoothEdge);
    vec2 uv = smoothstep(_size,
                        _size+aa,
                        _st);
    uv *= smoothstep(_size,
                    _size+aa,
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size, in float _smoothEdge){
    return  box(_st, vec2(_size,_size/4.), _smoothEdge) +
            box(_st, vec2(_size/4.,_size), _smoothEdge);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

vec2 tile(in vec2 _st, in float n) {
    _st *= n;
    return fract(_st);
    
}

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,2.0)) * 0.5;

    return fract(_st);
}

vec2 movingTileX(vec2 _st, float _zoom) {
    _st *= _zoom;

    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,2.0)) * u_time;
    _st.x += step(1., mod(_st.y + 1.0, 2.0)) * -u_time;

    return fract(_st);
}

vec2 movingTileY(vec2 _st, float _zoom) {
    _st *= _zoom;

    // Here is where the offset is happening
    _st.y += step(1., mod(_st.x,2.0)) * u_time;
    _st.y += step(1., mod(_st.x + 1.0, 2.0)) * -u_time;

    return fract(_st);
}


vec2 rotate2D(vec2 _st, float _angle) {
    _st -= .5;
    _st = rotate2d(_angle) * _st;
    _st += .5;
    return _st;
}

vec2 rotateTilePattern(vec2 _st){

    //  Scale the coordinate system by 2x2
    _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate each cell according to the index
    if(index == 1.0){
        //  Rotate cell 1 by 90 degrees
        _st = rotate2D(_st,PI*0.5);
    } else if(index == 2.0){
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st,PI*-0.5);
    } else if(index == 3.0){
        //  Rotate cell 3 by 180 degrees
        _st = rotate2D(_st,PI);
    }

    return _st;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
/* pattern1
	st = st * 3.0;
    vec2 tilePos = fract(st);
    if (mod(st.x, 2.0) > 1.0 || mod(st.y, 2.0) > 1.0) {
        color = vec3(cross(tilePos, 0.5), 0.1);
    } else {
    	color += vec3(circle(tilePos, 0.5));   
    }
*/
/* pattern2
    st = tile(st, 4.0);
    st = rotate2D(st, PI*0.25);
    color = vec3(box(st, vec2(0.70,0.70), 0.01));
*/
/* pattern3
    if (mod(u_time, 2.0) <= 1.0) {
    	st = movingTileX(st, 5.0);   
    } else {
    	st = movingTileY(st, 5.0);   
    }
    color = vec3(box(st, vec2(0.8), 0.01));
*/
/*
    st = tile(st, 3.0);
    st = rotateTilePattern(st);
    st = rotate2D(st, -PI*u_time*0.2);
    st = tile(st, 1.212);
    // st = rotateTilePattern(st);
    st = rotate2D(st, PI*u_time * 0.25);
    color = vec3(step(st.x, st.y));
*/
/* random1
    float rnd = random(st);
    color = vec3(rnd);
*/
/*
    st *= 10.0;
    st.x += u_time;
    vec2 ipos = floor(st);
    st = rotate2D(st - vec2(0.5), PI/2.0);
    vec2 fpos = fract(st);
    // color = vec3(random( ipos ));
    // color = vec3(fpos, 0.0);
    vec2 tile = truchetPattern(fpos, random(ipos));
    color = vec3(smoothstep(tile.x-0.3,tile.x,tile.y)-
            smoothstep(tile.x,tile.x+0.3,tile.y));
    color = vec3 ((step(length(tile),0.6) -
             step(length(tile),0.4) ) +
            (step(length(tile-vec2(1.)),0.6) -
             step(length(tile-vec2(1.)),0.4) ));
*/
/*
    float cols = 70.;
    float freq = random(floor(u_time))+abs(atan(u_time)*0.1);
    float t = 60.+u_time*(1.0-freq)*30.000;

    if (fract(st.y*cols) < .5){
        t *= -random(floor(st.y * cols));
    } else {
        t *= random(floor(st.y * cols));
    }

    freq += random(floor(st.y * cols));

    float offset = -0.247;
    color = vec3(randomSerie(st.x, freq*5.0 +0.048*sin(u_time), t+offset),
                 randomSerie(st.x, freq*5., t),
                 randomSerie(st.x, freq*5.0 +0.016*sin(u_time), t-offset));
*/
    gl_FragColor = vec4(color,1.0);
}