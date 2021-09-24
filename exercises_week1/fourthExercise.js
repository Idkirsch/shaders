window.onload = function init(){


	var canvas = document.getElementById("c");
	

	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	var vertices = [ vec2(0.0, 0.5), vec2(-0.5, -0.0), vec2(0.5, -0.0), vec2(0.0, -0.5), vec2(-0.5, -0.0), vec2(0.5, -0.0)];
 	var vBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  	var vPosition = gl.getAttribLocation(program, "a_Position");
 	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vPosition);



 	var colors = [ vec3(1,0,0), vec3(0,1,0), vec3(0,0,1), vec3(0,1,0), vec3(0,0,1), vec3(1,0,0)]
	var cBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  	var vColor = gl.getAttribLocation(program, "a_Color");
 	gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vColor);

 	theta=1;

 // //send the value of theta from the application to the shader
 	var thetaLoc = gl.getUniformLocation(program, "theta");
 	
	var numPoints = vertices.length;
 	

 	function tick(){
 		render(gl, numPoints);
 		requestAnimationFrame(tick);
 		gl.uniform1f(thetaLoc, theta);
 		theta = theta+ 0.01;

 	}

 	tick();

}

function render(gl, numPoints){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, numPoints);
}


