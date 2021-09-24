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
	var numberOfSides = 6;
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

 
 		drawCircle(0,0,0.3,5);

 		var pts = [0,0];
         
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



            // Binding the buffer for the vertices and adding data
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
            gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(pts));
           
            // Binding the buffer for colors and adding colors
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)	;
			// gl.bufferData(gl.ARRAY_BUFFER, flatten(colors[colorIndex]), gl.STATIC_DRAW);
			gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(colors[3]));



 			index++;
 			console.log("index from eventlistener: "+index);


            // this line does so the first point in the buffer is overwritten by the last one
            // numPoints = Math.max(numPoints, index);
           	// index %= maxVertices;

			// Maybe this re-renders pr mouseDown, but we gotta find out how to make positions dynamic pr click
			render();

	// 	}
	// }


 	function render(){
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, 8);

	}



}




