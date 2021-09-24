window.onload = function init(){


	//connect to the canvas element and call it c
	var canvas = document.getElementById("c");
	
	//get a context (gl) from the canvas element
	var gl = canvas.getContext("webgl"); 

	//set the background color
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	// set bitplane area to values set in clearColor
	gl.clear(gl.COLOR_BUFFER_BIT); 

	
	// initialize shaders
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);
 	// initialize array with some vertices	
 	// NOTE: this array is defining for number of points we are able to draw later
 	var vertices = [ vec2(), vec2(), vec2(),vec2(),vec2(),vec2() ];
 	//initialize buffer for vertices
 	var vBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

 	// get a position for a vertice from a shader
 	var vPosition = gl.getAttribLocation(program, "a_Position");
 	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vPosition);
	
 	//create new buffer for drawing points
	var pBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);

	
 	//Draw points on mouseclick
 	//somehow it only works correctly with three points- the fourht is offset and then it stops drawing
 	canvas.addEventListener("mousedown", MouseDown, false);
 	var index = 0;
    var idx = 0;
	function MouseDown(event){
		//console.log(event);
		if(0 === event.button){
			//console.log("left mouse button pressed")
			 x=2*event.clientX/canvas.width-1;
                y=2*(canvas.height-event.clientY)/canvas.height-1;
                var pts = [x, y];
                //points.push(pts);

                gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*index++, new Float32Array(pts));
                //console.log("index: "+index);
		}
	}

	


	//Clear canvas button
	var clearButton = document.getElementById("ClearButton");
	clearButton.addEventListener("click", function(){
		console.log("clear canvas button was clicked");
		// points.clear()

	})

	function clearCanvas(){
		
	}



 	render();

 	function render(){
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.POINTS, 0, index);
		window.requestAnimationFrame(render, canvas);
	}

}



