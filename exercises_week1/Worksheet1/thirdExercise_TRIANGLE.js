window.onload = function init(){


	var canvas = document.getElementById("c");
	

	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	// these are used as an offset in an attempt to move the triangle around on the 2D plane
	var Tx = 0.5, Ty = 0.5, Tz = 0.0;
	//this is an angle used for one-time rotation
	var ANGLE = 50.0;
	// this angle is used for animated rotation
	var ANGLE_STEP = 45.0;
	// this is variables used for scaling
	var Sx = 1.0, Sy = 1.5, Sz = 1.0;


	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	var vertices = [ vec2(0.0, 0.5), vec2(-0.5, -0.5), vec2(0.5, -0.5) ];
 	var colors = [ vec3(1,0,0), vec3(0,1,0), vec3(0,0,1)]
 	
	
//this is the date that is required to rotate the triangle
	var radian = Math.PI * ANGLE/180.0; //converting to radians
	var cosB = Math.cos(radian), sinB = Math.sin(radian);

	var rotateMatrix = new Float32Array([
		cosB, sinB, .0, .0,
		-sinB, cosB, .0, .0,
		.0, .0, 1.0, .0,
		.0, .0, .0, 1.0
		]);

	var translateMatrix = new Float32Array([
		1.0, .0, .0, .0,
		.0, 1.0, .0, .0,
		.0, .0, 1.0, .0,
		Tx, Ty, Tz, 1.0
	]);

	var scaleMatrix = new Float32Array([
		Sx,.0,.0,.0,
		.0,Sy,.0,.0,
		.0,.0,Sz,.0,
		.0,.0,.0,1.0
		]);


	var u_rotateMatrix = gl.getUniformLocation(program, "u_rotateMatrix");
	gl.uniformMatrix4fv(u_rotateMatrix, false, rotateMatrix);

	var u_translateMatrix = gl.getUniformLocation(program, "u_translateMatrix");
	gl.uniformMatrix4fv(u_translateMatrix, false, translateMatrix);

	var u_scaleMatrix = gl.getUniformLocation(program, "u_scaleMatrix");
	gl.uniformMatrix4fv(u_scaleMatrix, false, scaleMatrix);


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

