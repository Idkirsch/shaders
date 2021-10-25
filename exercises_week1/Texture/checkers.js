window.onload = function init(){


	var canvas = document.getElementById("c");
	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.0, 0.0, 0.0, 0.9);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	var vertices = [
		// X, Y , Z, ?
		vec4(-4, -1, -1, 1.0),
		vec4(4, -1, -1, 1.0),
		vec4(4, -1, -21, 1.0),
		vec4(-4, -1, -21, 1.0)
	
	];

	var texCoords = [
		vec2(-1.5,0),
		vec2(2.5,0),
		vec2(2.5,10),
		vec2(-1.5,10)
	]; 	


	var vertexColors = [
		[ 1.0, 1.0, 1.0, 1.0 ], // white
		[ 1.0, 0.0, 0.0, 1.0 ], // red
		[ 0.0, 0.0, 1.0, 1.0 ], // blue
		[ 0.0, 1.0, 0.0, 1.0 ] // green

	];

//computing an image that looks like a chessboard

	var texSize = 64;
	var numRows = 8;
	var numCols = 8;	
	var myTexels = new Uint8Array(4*texSize*texSize);

	for(var i = 0; i < texSize; ++i)
		for(var j = 0; j < texSize; ++j)
		{
			var patchx = Math.floor(i/(texSize/numRows));
			var patchy = Math.floor(j/(texSize/numCols));
			var c = (patchx%2 !== patchy%2 ? 255 : 0);
			var idx = 4*(i*texSize + j);
			myTexels[idx] = myTexels[idx + 1] = myTexels[idx + 2] = c;
			myTexels[idx + 3] = 255;
		}
	console.log(myTexels);


	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);
 

 	var eye = vec3(0,0,0);
 	var up = vec3(0,1,0);
 	var at = vec3(0,0,-1);

 	var V = lookAt(eye, at, up);
 	// perspective(fieldOfView, aspectRatio, near, far);
 	var P = perspective(90, canvas.width/canvas.height, 0.1, 50);

 	var vLocation = gl.getUniformLocation(program, "modelViewMatrix")
 	gl.uniformMatrix4fv(vLocation, false, flatten(V));
  
	var pLocation = gl.getUniformLocation(program, "projectionMatrix")
 	gl.uniformMatrix4fv(pLocation, false, flatten(P));






 //vertexbuffer
 	var positionBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	var attributePosition = gl.getAttribLocation(program, 'a_Position');
 	gl.vertexAttribPointer(attributePosition, 4, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(attributePosition);

//texelbuffer
 	var tBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);
 	
 	var vTexCoord = gl.getAttribLocation(program, "aTexCoord");
 	gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vTexCoord);


 	var texture = gl.createTexture();
 	gl.bindTexture(gl.TEXTURE_2D, texture);
 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);
	gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

	render(gl, vertices.length);


}


function render(gl, numPoints){

	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, numPoints);
	// gl.drawElements(gl.TRIANGLE_FAN, numVertices, gl.UNSIGNED_BYTE, 0);

}

function generateCheckers (texSize) {
	// for(var i = 0; i < texSize; ++i)
	// 	for(var j = 0; j < texSize; ++j)
	// 	{
	// 		var patchx = Math.floor(i/(texSize/numRows));
	// 		var patchy = Math.floor(j/(texSize/numCols));
	// 		var c = (patchx%2 !== patchy%2 ? 255 : 0);
	// 		var idx = 4*(i*texSize + j);
	// 		myTexels[idx] = myTexels[idx + 1] = myTexels[idx + 2] = c;
	// 		myTexels[idx + 3] = 255;
	// 	}
}

