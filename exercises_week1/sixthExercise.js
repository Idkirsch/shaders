window.onload = function init(){


	var canvas = document.getElementById("c");
	
	var index = 0;
	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	var vertices=[];
	var colors = [ vec3(1,0,0)];

	console.log("index " +index)

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	// drawCircle(0,0,0.3,5);
 	// vertices.push(vec2(0,0));

	canvas.addEventListener("mousedown", MouseDown, false);
	function MouseDown(event){
		console.log("clicked")

		try {
			// statements
			// vertices.push(vec2(0.3,0.3));

			drawCircle(0.5,0.5,0.3,5);
			var numPoints = vertices.length;
			render(gl, numPoints);
			console.log(vertices)



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

			var numPoints = vertices.length;
			render(gl, numPoints);

		} catch(e) {
			// statements
			console.log(e);
		}
		
		
	}



	function drawCircle(x, y, radius,  numberOfSides){
		// console.log("drawing a circle");
		// console.log("x: "+x+", y: "+y);
		numberOfVertices = numberOfSides+2;	
		console.log("index: "+index)

		vertices.push(vec2(x,y));
		
		// console.log("vertex: "+ vec2(x,y) + "added at index "+index)
			for(i=0; i<numberOfVertices; i++)
			{
				vertices.push(vec2(
					radius*Math.cos(i * 2 * Math.PI /numberOfSides)+x,
					radius*Math.sin(i * 2 * Math.PI /numberOfSides)+y  
					))	
				index++
				// console.log("index from circleloop: "+index);
				// console.log("vertex being added in circleloop: "+vec2(
				// 	radius*Math.cos(i * 2 * Math.PI /numberOfSides),
				// 	radius*Math.sin(i * 2 * Math.PI /numberOfSides)  
				// 	)+ " at index: "+index);
			}		
	}

 // 	var vBuffer = gl.createBuffer();
 // 	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
 // 	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
 //  	var vPosition = gl.getAttribLocation(program, "a_Position");
 // 	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
 // 	gl.enableVertexAttribArray(vPosition);

	// var cBuffer = gl.createBuffer();
 // 	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
 // 	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
 //  	var vColor = gl.getAttribLocation(program, "a_Color");
 // 	gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
 // 	gl.enableVertexAttribArray(vColor);

	// var numPoints = vertices.length;
	// render(gl, numPoints);
}

function render(gl, numPoints){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, numPoints);
	// gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
	// console.log("numpoints: "+numPoints);

}


