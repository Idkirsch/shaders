window.onload = function init(){



	var index = 0;
	var canvas = document.getElementById("c");
	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.0, 0.0, 0.0, 0.9);
	gl.clear(gl.COLOR_BUFFER_BIT); 
	var currentAngle = [20.0, 20.0]; // x-akse, y-akse
	initEventHandlers(canvas, currentAngle);

	
	var vertices = [
		// X, Y , Z, ?
		vec4(-0.5, -0.5, 0.5, 1.0),
		vec4(-0.5, 0.5, 0.5, 1.0),
		vec4(0.5, 0.5, 0.5, 1.0),
		vec4(0.5, -0.5, 0.5, 1.0),
		vec4(-0.5, -0.5, -0.5, 1.0),
		vec4(-0.5, 0.5, -0.5, 1.0),
		vec4(0.5, 0.5, -0.5, 1.0),
		vec4(0.5, -0.5, -0.5, 1.0)
	];


	var indices = [
		1, 0, 3,
		3, 2, 1,
		2, 3, 7,
		7, 6, 2,
		3, 0, 4,
		4, 7, 3,
		6, 5, 1,
		1, 2, 6,
		4, 5, 6,
		6, 7, 4,
		5, 4, 0,
		0, 1, 5
	];



	var vertexColors = [
		[ 1.0, 0.0, 0.0, 1.0 ], // red
		[ 1.0, 0.0, 0.0, 1.0 ], // red
		[ 0.0, 0.0, 1.0, 1.0 ], // blue
		[ 1.0, 0.0, 0.0, 1.0 ], // red
		[ 1.0, 1.0, 1.0, 1.0 ], // white
		[ 1.0, 1.0, 1.0, 1.0 ], // white

		[ 0.0, 0.0, 1.0, 1.0 ], // blue
	

		[ 0.0, 1.0, 0.0, 1.0 ], // green
		[ 1.0, 1.0, 0.0, 1.0 ], // yellow
		[ 1.0, 0.0, 1.0, 1.0 ], // magenta
		[ 1.0, 1.0, 1.0, 1.0 ], // white
		[ 0.0, 1.0, 1.0, 1.0 ] // cyan
	];

	
	function initEventHandlers(canvas, currentAngle){
		var dragging = false;
		var lastX = -1, lastY = -1;

		canvas.onmousedown = function(ev){
			var x = ev.clientX, y = ev.clientY;
			var rect = ev.target.getBoundingClientRect();
			if(rect.left <= x && x < rect.right && rect.top <= y && y< rect.bottom){
				lastX = x; lastY = y;
				dragging = true;
			}
		};

		canvas.onmouseup = function(ev){
			dragging = false;
		}

		canvas.onmousemove = function(ev){
			var x = ev.clientX, y = ev.clientY;
			if(dragging){
				var factor = 100/canvas.height;
				var dx = factor * (x - lastX);
				var dy = factor * (y - lastY);
				console.log("dx: "+dx+", dy: "+dy);

				// Limit x-axis rotation angle to -90 to 90 degrees
				currentAngle[0] = Math.max(Math.min(currentAngle[0]+dy, 90.0), -90.0);
				currentAngle[1] = currentAngle[1]+dx;
			}
			lastX = x, lastY = y;
		};
	}



	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);
 
 	var eye = vec3(3,3,2);
 	var up = vec3(0,1,0);
 	var at = vec3(0,0,0);

 	var View = lookAt(eye, at, up);
 	var Perspective = perspective(30, canvas.width/canvas.height, 0.1, 100);
 	
 //this is the data that is required to rotate 
	// var radian = Math.PI * currentAngle[0]/180.0; //converting to radians
	// var cosB = Math.cos(radian), sinB = Math.sin(radian);

	// var rotateMatrix = new Float32Array([
	// 	cosB, sinB, .0, .0,
	// 	-sinB, cosB, .0, .0,
	// 	.0, .0, 1.0, .0,
	// 	.0, .0, .0, 1.0
	// 	]);

	// var u_rotateMatrix = gl.getUniformLocation(program, "u_rotateMatrix");
	// gl.uniformMatrix4fv(u_rotateMatrix, false, rotateMatrix);
 	
 	var u_modelViewMatrix = gl.getUniformLocation(program, "u_modelViewMatrix");
 	gl.uniformMatrix4fv(u_modelViewMatrix, false, flatten(View));

 	var u_projectionMatrix = gl.getUniformLocation(program, "u_projectionMatrix");
 	gl.uniformMatrix4fv(u_projectionMatrix, false, flatten(Perspective));
  
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


	function tick(){
		currentAngle[0] = currentAngle[0] + 0.1;
		var radian = Math.PI * currentAngle[0]/180.0; //converting to radians
		var cosB = Math.cos(radian), sinB = Math.sin(radian);

		var rotateMatrix = new Float32Array([
			cosB, sinB, .0, .0,
			-sinB, cosB, .0, .0,
			.0, .0, 1.0, .0,
			.0, .0, .0, 1.0
			]);
		// the TA is pretty sure that I can use the library so I don't have to code
		// all the different rotationmatrices by hand
	

		var u_rotateMatrix = gl.getUniformLocation(program, "u_rotateMatrix");
		gl.uniformMatrix4fv(u_rotateMatrix, false, rotateMatrix);


		requestAnimationFrame(tick);
		render(gl, vertices.length, indices.length);
	}
	tick();


}


function render(gl, numPoints, numVertices){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);
}




	