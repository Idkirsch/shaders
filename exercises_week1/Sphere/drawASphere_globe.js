var vertices = [];
var vertexColors = [];
var normalsArray = [];
var numTimesToSubdivide = 4;
var image = document.createElement('img');




window.onload = function init(){

	var canvas = document.getElementById("c");
	var gl = canvas.getContext("webgl"); 
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.clearColor(0.0, 0.0, 0.0, 0.3);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(gl.program);

 	var lightPos = vec4(0,0,-1,0);
 	gl.uniform4fv(gl.getUniformLocation(gl.program, "lightPos"), flatten(lightPos));

 	//image
 	image.crossorigin = 'anonymous';
 	image.onload = function(){
 		// Insert WebGL texture initialization here

 		const texture = gl.createTexture();
 		gl.bindTexture(gl.TEXTURE_2D, texture);

 		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
 		gl.uniform1i(gl.getUniformLocation(gl.program, "sampler"),0);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);

 	}
 	image.src = 'earth.jpg'

 	var beta = 0.0;
	var betaLoc = gl.getUniformLocation(gl.program, "beta")

 	initSphere(gl, numTimesToSubdivide);
 	view(gl)
 	function tick(){
 		beta += 0.01;
 		gl.uniform1f(betaLoc, beta);
 		requestAnimationFrame(tick);
		render(gl, vertices.length);
 	}
 	tick();
}



// divide triangles into smaller triangles
function tetrahedron(a,b,c,d,n){
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

function divideTriangle(a,b,c,count){
	if (count > 0) {
		var ab = normalize(mix(a, b, 0.5), true);
		var ac = normalize(mix(a, c, 0.5), true);
		var bc = normalize(mix(b, c, 0.5), true);
		divideTriangle(a, ab, ac, count - 1);
		divideTriangle(ab, b, bc, count - 1);
		divideTriangle(bc, c, ac, count - 1);
		divideTriangle(ab, bc, ac, count - 1);
	} else {
		triangle(a, b, c);
	}
}

// pushing values to arrays
function triangle(a,b,c){
	vertices.push(a);
	vertices.push(b);
	vertices.push(c);	

	vertexColors.push([.8,.9,.1,1]);
	vertexColors.push([.8,.9,.1,1]);
	vertexColors.push([.8,.9,.1,1]);

	normalsArray.push(vec4(a[0], a[1], a[2], 0.0));
	normalsArray.push(vec4(b[0], b[1], b[2], 0.0));
	normalsArray.push(vec4(c[0], c[1], c[2], 0.0));
}


function view(gl){
	var eye = vec3(0,0,0);
 	var up = vec3(0,1,0);
 	var at = vec3(0.5,0.0,-0.5);

 	var viewMatrix = lookAt(eye, at, up);

 	var viewLocation = gl.getUniformLocation(gl.program, "ViewMatrix")
 	gl.uniformMatrix4fv(viewLocation, false, flatten(viewMatrix));
}

function initSphere(gl, numTimesToSubdivide){
	var va = vec4(0.0, 0.0, 1.0, 1);
	var vb = vec4(0.0, 0.942809, -0.333333, 1);
	var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
	var vd = vec4(0.816497, -0.471405, -0.333333, 1);
	tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	var numVertices = vertices.length;


//vertexbuffer
	gl.deleteBuffer(gl.positionBuffer)
 	gl.positionBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, gl.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
 //html connection
	var attributePosition = gl.getAttribLocation(gl.program, 'a_Position');
 	gl.vertexAttribPointer(attributePosition, 4, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(attributePosition);	
//colorbuffer
	gl.deleteBuffer(gl.cBuffer)
	gl.cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
 //html connection
 	var attributeColor = gl.getAttribLocation(gl.program, "a_Color");
 	gl.vertexAttribPointer(attributeColor, 4, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(attributeColor);

//normalbuffer
	gl.deleteBuffer(gl.normalsBuffer);
	gl.normalsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.normalsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

	var attributenormal = gl.getAttribLocation(gl.program, "a_Normal");
 	gl.vertexAttribPointer(attributenormal, 4, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(attributenormal);

//bind texture

}


function render(gl, numPoints){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, numPoints);
	// gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);

}


