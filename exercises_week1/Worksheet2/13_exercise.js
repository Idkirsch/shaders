window.onload = function init(){
	var canvas = document.getElementById("canvas");
	
	//get a context (gl) from the canvas element
	var gl = canvas.getContext("webgl"); 
	//index is like a pointer to the buffer
 	var index = 0;
  	//numPoints has the number of points in the buffer, and can be used to control how much is drawn
 	var numPoints = 0;
 	// this array stores all the vertices used for points, triangles and circles
    var vertices = [];
    // this array stores the index of the points
    var points = [];
    // this array stores the index of the starting point of a triangle
    var triangles = [];
    var circles=[];
    var colorIndex = 0;
	var maxVertices = 5000;
	var drawPoints = 0; // 0 = points, 1 = triangles, 2 = circles
	var counterForTriangle = 0;
	var counterForCircle = 0;
	var numberOfSides = 60;
	var numberOfVertices = numberOfSides+2;


	//set the background color
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	// set bitplane area to values set in clearColor
	gl.clear(gl.COLOR_BUFFER_BIT); 


   // initialize shaders
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	//initialize buffer for vertices
 	var vBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, maxVertices*sizeof['vec2'], gl.STATIC_DRAW);

 	//html connection
	var attributePosition = gl.getAttribLocation(program, 'a_Position');
 	gl.vertexAttribPointer(attributePosition, 2, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(attributePosition);


 	//initialize buffer for colors
 	var colorBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, maxVertices*sizeof['vec4'], gl.STATIC_DRAW);

 	var vertexColor = gl.getAttribLocation(program, "a_Color");
 	gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vertexColor);

 		// Here are the colors for the colormeu
	var colors = [
		vec4(0.0, 0.0, 0.0, 1.0), // black
		vec4(1.0, 0.0, 0.0, 1.0), // red
		vec4(1.0, 1.0, 0.0, 1.0), // yellow
		vec4(0.0, 1.0, 0.0, 1.0), // green
		vec4(0.0, 0.0, 1.0, 1.0), // blue
		vec4(1.0, 0.0, 1.0, 1.0), // magenta
		vec4(0.0, 1.0, 1.0, 1.0) // cyan
	];

 
	//Draw points on mouseclick
 	canvas.addEventListener("mousedown", MouseDown, false);
	function MouseDown(event){
		var boundingBox = event.target.getBoundingClientRect();
		x=2*(event.clientX - boundingBox.left)/canvas.width-1;
        y=2*(canvas.height-event.clientY+boundingBox.top)/canvas.height-1;
        var pts = [x, y];
        // vertices.push(pts);

        if (drawPoints === 0){ //drawing points
        	points.push(index);
        	counterForTriangle = 0;
        	counterForCircle = 0;
        	document.getElementById("drawingModeText").innerText= "drawing points";
        } else if (drawPoints === 1) { //drawing triangles
        	document.getElementById("drawingModeText").innerText= "drawing triangles";
        	points.push(index);
        	if(counterForTriangle === 2){
        		points.pop();
        		points.pop();
        		triangles.push(points.pop());
        		counterForTriangle=-1; // i dont know why it has to be -1, but it works :-s
        	}
        	counterForTriangle++;
        } else if (drawPoints === 2) { //drawing circles
        	document.getElementById("drawingModeText").innerText= "drawing circles";
			
			var radius = 0.1;
			circles.push(index);
			// vertices.push(vec2(x,y));
			vertices.push(vec2(x,y));
			counterForCircle = 0;

	        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
	        gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(vec2(x,y)));
	       
	        // Binding the buffer for colors and adding colors
	        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)	;
			gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(colors[colorIndex]));

			index++

			for(i=0; i<=numberOfSides; i++) {
				var vertex = (vec2(
					radius*Math.cos(i * 2 * Math.PI /numberOfSides)+x,
					radius*Math.sin(i * 2 * Math.PI /numberOfSides)+y  
					))
			        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
			        gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(vertex));
			       
			        // Binding the buffer for colors and adding colors
			        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)	;
					gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(colors[colorIndex]));	
				index++;

			}		
			console.log(vertices)
        }

        // Binding the buffer for the vertices and adding data
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
        gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(pts));
       
        // Binding the buffer for colors and adding colors
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)	;
		gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(colors[colorIndex]));

		index++;

        // this line does so the first point in the buffer is overwritten by the last one
        numPoints = Math.max(numPoints, index);
       	index %= maxVertices;


		render();

		
	}



	// render();

 	function render(){
		gl.clear(gl.COLOR_BUFFER_BIT);
		// console.log("vertices: "+vertices);

		for(i = 0; i < points.length; i++){
			// console.log("render function point at index: "+points[i]);
			gl.drawArrays(gl.POINTS, points[i], 1);
		}	
		for(i = 0; i < triangles.length; i++){
			// console.log("render function triangle at index: "+triangles[i]);
			if(triangles[i]){
				gl.drawArrays(gl.TRIANGLES, triangles[i], 3);
			}
		}
		for(i = 0; i < circles.length; i++){
			
				gl.drawArrays(gl.TRIANGLE_FAN, circles[i], numberOfVertices);
				// gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
			
		}
	}





	//this clears the canvas and sets index to 0 which means that all the data that was in the buffer will be overwritten
	var clearButton = document.getElementById("ClearButton");
	clearButton.addEventListener("click", function(event){
			index =0;
			numPoints = 0;
			render();
	})

	var pointsButton = document.getElementById("drawPointsButton");
	pointsButton.addEventListener("click", function(event){
		drawPoints = 0;
		// console.log("clicked on draw points");
	})

	var triangleButton = document.getElementById("drawTrianglesButton");
	triangleButton.addEventListener("click", function(event){
		drawPoints = 1;
		// console.log("clicked on draw triangles");	
	})

	var circleButton = document.getElementById("drawCirclesButton");
	circleButton.addEventListener("click", function(event) {
		drawPoints = 2;
		console.log("clicked on draw circles");
	})


	var menu = document.getElementById("mymenu");
	menu.addEventListener("click", function(event){
		colorIndex = menu.selectedIndex;
	})

}




