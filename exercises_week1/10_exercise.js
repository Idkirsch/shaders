window.onload = function init(){
	var canvas = document.getElementById("canvas");
	
	//get a context (gl) from the canvas element
	var gl = canvas.getContext("webgl"); 
	//index is like a pointer to the buffer
 	var index = 0;
  	//numPoints has the number of points in the buffer, and can be used to control how much is drawn
 	var numPoints = 0;

    var vertices = [];


	//set the background color
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	// set bitplane area to values set in clearColor
	gl.clear(gl.COLOR_BUFFER_BIT); 

   
 	//initialize buffer for vertices
 	var vBuffer = gl.createBuffer();
 	

 	var maxVertices = 10; 

 	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, maxVertices*sizeof['vec2'], gl.STATIC_DRAW);
 	// gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);



	// initialize shaders
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);

 	// html connection some how
 	var a_Position = gl.getAttribLocation(program, 'a_Position');
 	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(a_Position);


 
	//Draw points on mouseclick
 	canvas.addEventListener("mousedown", MouseDown, false);
	function MouseDown(event){
		if(0 === event.button){
			console.log("index: "+index);
			console.log("numPoints: "+numPoints);

			var boundingBox = event.target.getBoundingClientRect();
		

			// console.log("left mouse button pressed at");
			// console.log(event);
			x=2*(event.clientX - boundingBox.left)/canvas.width-1;
            y=2*(canvas.height-event.clientY+boundingBox.top)/canvas.height-1;
            
            var pts = [x, y];
            vertices.push(pts);


            // TO DO
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
            
            gl.bufferSubData(gl.ARRAY_BUFFER,  index*sizeof['vec2'], new Float32Array(pts));
            index++;
            // this line does so the first point in the buffer is overwritten by the last one
            numPoints = Math.max(numPoints, index);
           	index %= maxVertices;
			// Maybe this re-renders pr mouseDown, but we gotta find out how to make positions dynamic pr click
			render();

		}
	}

//this clears the canvas and sets index to 0 which means that all the data that was in the buffer will be overwritten
	var clearButton = document.getElementById("ClearButton");
	clearButton.addEventListener("click", function(event){
			index =0;
			numPoints = 0;
			render();
	})



	render();

 	function render(){
		gl.clear(gl.COLOR_BUFFER_BIT);
		//tjek at index/numPoints ikke overskrider allokeret plads
		gl.drawArrays(gl.POINTS, 0, numPoints);
		// skal kun bruges til animationer
		// window.requestAnimationFrame(render, canvas);
	}



}