window.onload = function init(){


	var canvas = document.getElementById("c");
	

	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	// these are used as an offset in an attempt to move the triangle around on the 2D plane
	var Tx = 0.5, Ty = 0.5, Tz = 0.0;
	//this is an angle used for the rotation
	var ANGLE = 30.0;


	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	var vertices = [ vec2(0.0, 0.5), vec2(-0.5, -0.5), vec2(0.5, -0.5) ];
 	var colors = [ vec3(1,0,0), vec3(0,1,0), vec3(0,0,1)]
 	

	// this is where the offset is connected to the vertex shader
	var u_Translation = gl.getUniformLocation(program, "u_Translation");
	gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);
	
	//this is the date that is required to rotate the triangle
	var radian = Math.PI * ANGLE/180.0; //converting to radians
	var cosB = Math.cos(radian);
	var sinB = Math.sin(radian);
	var u_CosB = gl.getUniformLocation(program, "u_CosB");
	var u_SinB = gl.getUniformLocation(program, "u_SinB");
	gl.uniform1f(u_CosB, cosB);
	gl.uniform1f(u_SinB, sinB);




 	var vBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  	var vPosition = gl.getAttribLocation(program, "a_Position");
 	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vPosition);


	var cBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  	var vColor = gl.getAttribLocation(program, "a_Color");
 	gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vColor);

 	gl.drawArrays(gl.TRIANGLES, 0, vertices.length);

}

