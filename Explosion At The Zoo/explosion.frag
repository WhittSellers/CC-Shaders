precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_explode;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float circle(vec2 frag_coord, float radius) {
    return length(frag_coord) - radius;
}

void main(void) { 
  vec2 fragCoord_N = gl_FragCoord.xy / u_resolution;
  
  vec2 mouse_N = u_mouse / u_resolution;

  float d = distance(mouse_N, fragCoord_N);
  float r = rand(gl_FragCoord.xy + 0.001 * u_time);
  
  float circRad = abs(sin(mouse_N.x + u_time));
  circRad = clamp(circRad, 0.0, 0.1);
  
  vec2 circle_coord = fragCoord_N - mouse_N;
  float circle_sdf = circle(circle_coord, circRad);

  circle_sdf = 1.0 - circle_sdf;

  vec3 explodeCol = vec3(1.0, 0.4039 * r, 0.0078);

  explodeCol = mix(vec3(circle_sdf), explodeCol, step(0.1, r));

  float explAlpha = step((d * abs(sin(mouse_N.x + u_time * 1.1))), 0.1);

  vec4 compCol = vec4(explodeCol, explAlpha);
  
  compCol = vec4(mix(vec3(0.0, 0.0, 0.0), explodeCol, step(d, explAlpha)), explAlpha);
  
  

  gl_FragColor = vec4(compCol);

}