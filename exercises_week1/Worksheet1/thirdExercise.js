window.onload = function init(){


	var canvas = document.getElementById("c");
	

	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	// these are used as an offset in an attempt to move the triangle around on the 2D plane
	var Tx = 0.5, Ty = 0.5, Tz = 0.0;

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	var vertices = [ vec2(0.0, 0.5), vec2(-0.5, -0.5), vec2(0.5, -0.5) ];
 	var colors = [ vec3(1,0,0), vec3(0,1,0), vec3(0,0,1)]
 	
// TEXTURE --------------
 	var tex = gl.createTexture();
 	gl.bindTexture(gl.TEXTURE_2D, tex);
 	var level = 0;
 	var width = 2;
 	var height = 1;
 	var data = new Uint8Array([
 	   255, 0, 0, 255,   // a red pixel
 	   0, 255, 0, 255,   // a green pixel
 	]);

 	gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

 	var someSamplerLoc = gl.getUniformLocation(program, "u_texture");
 	
 	var unit = 5;  // Pick some texture unit
 	gl.activeTexture(gl.TEXTURE0 + unit);
 	gl.bindTexture(gl.TEXTURE_2D, tex);
 	gl.uniform1i(someSamplerLoc, unit);

// ------------------
	
	// this is where the offset is connected to the vertex shader
	var u_Translation = gl.getUniformLocation(program, "u_Translation");
	gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);
	

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

