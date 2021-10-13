// Got code help from Sarah, Jay, and Nico's Shader Jam homework for passing in uniform variables and general web syntax

var explode = 1.0;

///////////////////////////
// Vertex Shader Program
const VS_SOURCE = `

precision highp float; 

attribute vec4 aVertexPosition;

uniform float uExplode;

varying vec4 vColor;

void main(void) {
  gl_Position = aVertexPosition;
}
`;
//const vertex_shader_source = await fetch(canvas.dataset.vert).then(r => r.text());

main();
async function main(){
  //console.log('Hello, WebGL!');
  
  ////////////////
  // Create the Context
  const canvas = document.querySelector("#webgl_target");
  const gl = canvas.getContext("webgl");
  
  let resolution_xy;

  resolution_xy = [canvas.width, canvas.height];
  
  //////////////////////
  // Keep track of the mouse position
  let mouse_xy = [0,0];
  
  document.addEventListener('mousemove', event => {
    let bounds = canvas.getBoundingClientRect();
    let x = event.clientX - bounds.left - canvas.clientLeft;
    let y = event.clientY - bounds.top - canvas.clientTop;
    mouse_xy = [x, bounds.height - y];
    console.log("mouse_xy", mouse_xy);
  })
  
  ////////////////
  // Compile/link the shader program
  
  // Compile the vertex shader
  const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
  
  gl.shaderSource(vertex_shader, VS_SOURCE); //replace VS_SOURCE with vertex_shader_source when vertex shader is moved to a separate file
  gl.compileShader(vertex_shader);
  
  if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
    console.log('Error in vertex shader: \n\n' + gl.getShaderInfoLog(vertex_shader));
    gl.deleteShader(vertex_shader);
    return null;
  }
  
  // Compile the fragment shader
  const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
  const frag_source = await fetch("./explosion.frag").then((r) => r.text());
  
  gl.shaderSource(fragment_shader, frag_source);
  gl.compileShader(fragment_shader);
  
  if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
    console.log('Error in fragment shader: \n\n' + gl.getShaderInfoLog(fragment_shader));
    gl.deleteShader(fragment_shader);
    return null;
  }
  
  // Link fragement and vertex shader
  const shader_program = gl.createProgram();
  gl.attachShader(shader_program, vertex_shader);
  gl.attachShader(shader_program, fragment_shader);
  gl.linkProgram(shader_program);
  
  if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
    alert('Error intializing shader program : \n\n' + gl.getProgramInfoLog(shader_program));
    return null;
  }
  
  
  ////////////////////////////////
  // Query the shaders for attribute and uniform locations
  const vertex_position_location = gl.getAttribLocation(shader_program, 'aVertexPosition');
  const vertex_color_location = gl.getAttribLocation(shader_program, 'aVertexColor');
  const u_resolution_location = gl.getUniformLocation(shader_program, 'u_resolution');
  const u_mouse_location = gl.getUniformLocation(shader_program, 'u_mouse');
  const u_time_location = gl.getUniformLocation(shader_program, 'u_time');
  const u_explosion = gl.getUniformLocation(shader_program, 'u_explode');
  
  ////////////////////////////////
  // Buffer the Vertex Data
  
  // Vertex Position Data
  const position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    const positions = [
        1.0, 1.0, // right top
        -1.0, 1.0, // left top
        1.0, -1.0, // right bottom
        -1.0, -1.0, // left bottom
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertex_position_location, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertex_position_location);
  
  // Vertex color data
  const color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  const colors = [
    1.0, 1.0, 1.0, 1.0, // white
    1.0, 0.0, 0.0, 1.0, // red
    0.0, 1.0, 0.0, 1.0, // green
    0.0, 0.0, 1.0, 1.0, // blue
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertex_color_location, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertex_color_location);
  
  ///////////////////////////////
  // Configure gl
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  
  
  ////////////////////////////////
  // Draw
  
  // Clear the background
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  /////////////////////////////
  // set up animation loop
  let start_time = Date.now();
  function render() {
    // activate our program
    gl.useProgram(shader_program);
    
    // update uniforms
    gl.uniform2fv(u_mouse_location, mouse_xy);
    gl.uniform1f(u_time_location, (Date.now() - start_time) * .001);
    gl.uniform1f(u_explosion, explode);
    gl.uniform2fv(u_resolution_location, resolution_xy);
    
    // draw the geometry
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
   }
  
   requestAnimationFrame(render);
  
  }