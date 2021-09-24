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

 	drawCircle(0,0,0.3,6);

 	




	// function drawCircle(x, y, radius,  numberOfSides){
	// 	console.log("drawing a circle");
	// 	numberOfVertices = numberOfSides+2;	
	// 	vertices.push(vec2(x,y));
	// 	for(i=0; i<numberOfVertices; i++)
	// 	{
	// 		vertices.push(vec2(
	// 			radius*Math.cos(i * 2 * Math.PI /numberOfSides)+x,
	// 			radius*Math.sin(i * 2 * Math.PI /numberOfSides)+y  
	// 			))	
	// 		colors.push(vec3(1,0,0));
	// 		console.log("vertex being added in loop: "+vec2(
	// 			radius*Math.cos(i * 2 * Math.PI /numberOfSides)+x,
	// 			radius*Math.sin(i * 2 * Math.PI /numberOfSides)+y  
	// 			));
	// 	}		
	// // console.log(vertices);

	// }

	function drawCircle(x, y, radius,  numberOfSides){
		// console.log("drawing a circle");
		// console.log("x: "+x+", y: "+y);
		numberOfVertices = numberOfSides+2;	
		console.log("index: "+index)

		vertices.push(vec2(x,y));
		
		console.log("vertex: "+ vec2(x,y) + "added at index "+index)
			for(i=0; i<numberOfVertices; i++)
			{
				vertices.push(vec2(
					radius*Math.cos(i * 2 * Math.PI /numberOfSides),
					radius*Math.sin(i * 2 * Math.PI /numberOfSides)  
					))	
				index++
				// console.log("index from circleloop: "+index);
				console.log("vertex being added in circleloop: "+vec2(
					radius*Math.cos(i * 2 * Math.PI /numberOfSides),
					radius*Math.sin(i * 2 * Math.PI /numberOfSides)  
					)+ " at index: "+index);
			}		
	}








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

 	// theta=1;

 // //send the value of theta from the application to the shader
 	// var thetaLoc = gl.getUniformLocation(program, "theta");
 	
	var numPoints = vertices.length;
 	

 	// function tick(){
 	// 	// render(gl, numPoints);
 	// 	requestAnimationFrame(tick);
 	// 	gl.uniform1f(thetaLoc, theta);
 	

 	// }

 	// tick();

	render(gl, numPoints);

}

function render(gl, numPoints){
	gl.clear(gl.COLOR_BUFFER_BIT);
	// gl.drawArrays(gl.TRIANGLE_FAN, 0, numPoints);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
	console.log("numpoints: "+numPoints);

}


