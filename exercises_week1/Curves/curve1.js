window.onload = function init(){
	var canvas = document.getElementById("canvas");
	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0); //set the background color
	gl.clear(gl.COLOR_BUFFER_BIT); // set bitplane area to values set in clearColor
   // initialize shaders
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	var index = 0;	//index is like a pointer to the buffer
 	var numPoints = 0; //numPoints has the number of points in the buffer, and can be used to control how much is drawn 
   var colorIndex = 0;
	var maxVertices = 30;
	var counterForTriangle = 0;
	var counterForLine = 0;
    
   var vertices = []; // this array stores all the vertices used for points, triangles and circles  
   var points = []; // this array stores the index of the points
   var triangles = []; // this array stores the index of the starting point of a triangle
   var lines = []; // array stores index of starting point of line
	var bezierCurvePoints = [];

	var drawPoints = true;
	var hasLineBeenDrawn = false;

 
 // Here are the colors for the colormeu
	var colors = [
		vec4(0.0, 0.0, 0.0, 1.0), // black
		vec4(1.0, 0.0, 0.0, 1.0), // red
		vec4(1.0, 1.0, 0.0, 1.0), // yellow
		vec4(0.0, 1.0, 0.0, 1.0), // green
		vec4(0.0, 0.0, 1.0, 1.0), // blue
		vec4(1.0, 0.0, 1.0, 1.0), // magenta
		vec4(0.0, 1.0, 1.0, 1.0), // cyan
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
		// console.log("index on mouseclick begin: "+ index)

		var boundingBox = event.target.getBoundingClientRect();

		x=2*(event.clientX - boundingBox.left)/canvas.width-1;
      y=2*(canvas.height-event.clientY+boundingBox.top)/canvas.height-1;
     
      var pts = [x, y];
      vertices.push(pts);
      points.push(index);


      if(counterForLine === 1){
      	calculateLine();
	     
      }
    	if(!hasLineBeenDrawn){
    		counterForLine++;
    	}

		// console.log("hasLineBeenDrawn : "+ hasLineBeenDrawn);

    	// this is where the beziercurve should be drawn
    	if(numPoints == 2){	
    		console.log("start drawing curve")
    		bezierCurve();
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

      console.log("points: "+points);
      console.log("lines: "+lines);


		render();

	}

	function calculateLine(){
			// console.log("index in beginning of calculateLine: "+ index);
			hasLineBeenDrawn = true;

			console.log("vertices.length: "+vertices.length)

			var P0_x = vertices[0][0];
			var P0_y = vertices[0][1];

			var P1_x = vertices[1][0];
			var P1_y = vertices[1][1];

			console.log("vertices: "+ vertices)
			console.log("P0: "+ vertices[0]);
			console.log("P1: "+ vertices[1]);

			 for (let t = 0; t < 1; t=t+0.1) {

	    		var linePointX = P0_x + (P1_x - P0_x)*t;
	    		var linePointY = P0_y + (P1_y - P0_y)*t;

	    		var linePoint = [ linePointX, linePointY];
	    		// console.log("linePoint: "+ linePoint);
	    		// console.log("t: "+t);
	    		var rainbowColor = Number.parseInt(t*10);

	     		vertices.push(linePoint);

	          // Binding the buffer for the vertices and adding data
	          gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
	          gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(linePoint));      
	          // Binding the buffer for colors and adding colors
	          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)	;
	    		gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(colors[rainbowColor]));
	     	
	     		numPoints++;
	     		index ++;
	     		// bezierCurvePoints.push(points.pop(index));
	     		lines.push(index);
	     		
	   }


	     	// lines.push(index-1);


			// console.log("index at end of calculateLine: "+ index);
			// console.log("index at end of calculateLine being pushed: "+ index-1);





	     	counterForLine = -1; // this makes sure that the line is only "drawn" once

	}

	function bezierCurve(){

		// print values of p0, p1 and p2
		// console.log("P0 : "+vertices[0]);
		// console.log("P0.x : "+vertices[0][0]);
		// console.log("P0.y : "+vertices[0][1]);
		// console.log("P1 : "+vertices[2]);
		// console.log("P2 : "+vertices[1]);

		// var t = 0.5;

		var P0_x = vertices[0][0];
		var P0_y = vertices[0][1];

		var P1_x = vertices[2][0];
		var P1_y = vertices[2][1];

		var P2_x = vertices[1][0];
		var P2_y = vertices[1][1];
	   
	   for (let t = 0; t < 1; t=t+0.1) {

	    		// var BezierTestPoint_x = P1_x + Math.pow((1-t),2)*(P0_x-P1_x)+Math.pow(t,2)*(P2_x-P1_x);
	    		// var BezierTestPoint_y = P1_y + Math.pow((1-t),2)*(P0_y-P1_y)+Math.pow(t,2)*(P2_y-P1_y);

	    		// var BezierTestPoint = [BezierTestPoint_x, BezierTestPoint_y];

	     	// 	vertices.push(BezierTestPoint);

	      //     // Binding the buffer for the vertices and adding data
	      //     gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
	      //     gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(BezierTestPoint));      
	      //     // Binding the buffer for colors and adding colors
	      //     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)	;
	    		// gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(colors[3]));
	     	
	     	// 	numPoints++;
	     	// 	index ++;
	     	// 	// bezierCurvePoints.push(points.pop(index));
	     	// 	bezierCurvePoints.push(index);
	     		
	   }
	}


	 	//initialize buffer for vertices
	 	var vBuffer = gl.createBuffer();
	 	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	 	gl.bufferData(gl.ARRAY_BUFFER, maxVertices*sizeof['vec2'], gl.STATIC_DRAW);
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



 	function render(){
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		
		if(hasLineBeenDrawn) {

			for(i = 0; i < numPoints; i++){
				gl.drawArrays(gl.POINTS, lines[i], 1);
				// console.log(vertices[i]);

			}	
		}
	
		for(i = 0; i < numPoints; i++){
			// console.log("render function point at index: "+points[i]);
			gl.drawArrays(gl.POINTS, points[i], 1);

			// console.log(vertices[i]);
			
		}	

		for(i = 0; i < bezierCurvePoints.length; i++){
			// console.log("render function point at index: "+points[i]);

			gl.drawArrays(gl.LINE_STRIP, bezierCurvePoints[i], 10);
	


		}	
	}
}




