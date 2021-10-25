window.onload = function init(){


	var canvas = document.getElementById("c");
	
	var index = 0;
	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.0, 0.0, 0.0, 0.9);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	var numVertices = 36;

	var vertices = [
		vec4(-0.5, -0.5, 0.5, 1.0),
		vec4(-0.5, 0.5, 0.5, 1.0),
		vec4(0.5, 0.5, 0.5, 1.0),
		vec4(0.5, -0.5, 0.5, 1.0),
		vec4(-0.5, -0.5, -0.5, 1.0),
		vec4(-0.5, 0.5, -0.5, 1.0),
		vec4(0.5, 0.5, -0.5, 1.0),
		vec4(0.5, -0.5, -0.5, 1.0)
	];
	// var indices = [
	// 	1, 0, 3,
	// 	3, 2, 1,
	// 	2, 3, 7,
	// 	7, 6, 2,
	// 	3, 0, 4,
	// 	4, 7, 3,
	// 	6, 5, 1,
	// 	1, 2, 6,
	// 	4, 5, 6,
	// 	6, 7, 4,
	// 	5, 4, 0,
	// 	0, 1, 5
	// ];

	var indices = [
		0,1,
		1,2,
		2,3,
		3,0,
		4,5,
		5,6,
		6,7,
		7,4,
		1,5,
		0,4,
		2,6,
		3,7
		
	
	];


	var vertexColors = [
		[ 1.0, 1.0, 1.0, 1.0 ], // white
		[ 1.0, 0.0, 0.0, 1.0 ], // red
		[ 0.0, 0.0, 1.0, 1.0 ], // blue
		[ 0.0, 1.0, 0.0, 1.0 ], // green
		[ 1.0, 1.0, 0.0, 1.0 ], // yellow
		[ 1.0, 0.0, 1.0, 1.0 ], // magenta
		[ 1.0, 1.0, 1.0, 1.0 ], // white
		[ 0.0, 1.0, 1.0, 1.0 ] // cyan
	];


	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);
 
 	var eye = vec3(0.1,0.1,0);
 	var up = vec3(0,1,0);
 	var at = vec3(0.5,0.5,0.5);

 	var V = lookAt(eye, at, up);
 	var vLocation = gl.getUniformLocation(program, "viewMatrix")
 	gl.uniformMatrix4fv(vLocation, false, flatten(V));
  
 //vertexbuffer
 	var positionBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	//html connection
	var attributePosition = gl.getAttribLocation(program, 'a_Position');
 	gl.vertexAttribPointer(attributePosition, 4, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(attributePosition);
	
//colorbuffer
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

 	//html connection
 	var vertexColor = gl.getAttribLocation(program, "a_Color");
 	gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vertexColor);


//indexbuffer
	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);
	 	
	render(gl, vertices.length, indices.length);

}

function render(gl, numPoints, numVertices){
	gl.clear(gl.COLOR_BUFFER_BIT);

	// gl.drawArrays(gl.POINTS, 0, numPoints);
	gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);

}


// function quad(a, b, c, d){
// 	var indices = [ a, b, c, a, c, d ];
// 	for (var i = 0; i < indices.length; ++i) {
// 	points.push(vertices[indices[i]]);
// 	colors.push(vertexColors[indices[i]]);
// 	}
// }