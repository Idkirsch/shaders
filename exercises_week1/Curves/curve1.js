window.onload = function init(){
	var canvas = document.getElementById("canvas");
	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0); //set the background color
	gl.clear(gl.COLOR_BUFFER_BIT); // set bitplane area to values set in clearColor
   // initialize shaders
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	var index = 0;	//index is like a pointer to the buffer
 	// var numPoints = 0; //numPoints has the number of points in the buffer, and can be used to control how much is drawn 
   var colorIndex = 0;
	var maxVertices = 30;
	var counterForTriangle = 0;
	var counterForLine = 0;
	var numberOfStepsOnCurve = 10;
    
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
		vec4(0.0, 1.0, 1.0, 1.0) // cyan
	];

 
	//Draw points on mouseclick
 	canvas.addEventListener("mousedown", MouseDown, false);
	function MouseDown(event){

		var boundingBox = event.target.getBoundingClientRect();

		x=2*(event.clientX - boundingBox.left)/canvas.width-1;
      y=2*(canvas.height-event.clientY+boundingBox.top)/canvas.height-1;
     
      var pts = [x, y];
      vertices.push(pts);
      points.push(index);

      if(counterForLine === 1){
	     	hasLineBeenDrawn = true;

	     	lines.push(index-1);
	     	counterForLine = -1;
      }
    	if(!hasLineBeenDrawn){
    		counterForLine++;
    	}

      // Binding the buffer for the vertices and adding data
     	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
      gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(pts));      
      // Binding the buffer for colors and adding colors
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)	;
		gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(colors[colorIndex]));

		index++;

   	// this is where the beziercurve should be drawn
    	if(points.length == 3){
    		bezierCurve();
    	}

 	
      index %= maxVertices;

      // console.log("vertices: "+vertices);
      // console.log("points: "+ points);
      // console.log("bezierCurvePoints: "+ bezierCurvePoints);
      // console.log("lines: "+ lines);
		render();

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
		var stepSize = 1/10;
	   
	   for (let t = 0; t < 1; t=t+stepSize) {
    		var BezierTestPoint_x = P1_x + Math.pow((1-t),2)*(P0_x-P1_x)+Math.pow(t,2)*(P2_x-P1_x);
    		var BezierTestPoint_y = P1_y + Math.pow((1-t),2)*(P0_y-P1_y)+Math.pow(t,2)*(P2_y-P1_y);
    		var BezierTestPoint = [BezierTestPoint_x, BezierTestPoint_y];

     		vertices.push(BezierTestPoint);

         gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
         gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(BezierTestPoint));      
         gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)	;
    		gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(colors[3]));
     	
     		bezierCurvePoints.push(index);
     		index ++;
	   }

	   for (let t = 0+stepSize; t < 1; t=t+stepSize) {
	   	bezierCurvePoints.pop();
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
		
		// console.log("hasLineBeenDrawn : "+hasLineBeenDrawn);
		if(hasLineBeenDrawn) {
			for(i = 0; i < lines.length; i++){
				gl.drawArrays(gl.LINES, lines[i], 2);
				// console.log(vertices[i]);
			}	
		}
	
		for(i = 0; i < points.length; i++){
			// console.log("render function point at index: "+points[i]);
			gl.drawArrays(gl.POINTS, points[i], 1);
			// console.log("points[i] "+ points[i])
			// console.log(vertices[i]);
			
		}	

		for(i = 0; i < bezierCurvePoints.length; i++){
			// console.log("render function point at index: "+points[i]);

			gl.drawArrays(gl.LINE_STRIP, bezierCurvePoints[i], numberOfStepsOnCurve+1); // It works when it's plus 1
			// console.log("bezierCurvePoints[i] "+bezierCurvePoints[i]);
			// console.log("bezierCurvePoints[i+1] "+bezierCurvePoints[i+1]);

		}	
	}
}




