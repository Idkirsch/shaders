window.onload = function init(){
	var canvas = document.getElementById("canvas");
	
	//get a context (gl) from the canvas element
	var gl = canvas.getContext("webgl"); 

 	var index = 0;
  
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
			//this deletes everything
			// if(index >= maxVertices){
			// 	index = 0;
			// }
		

			console.log("left mouse button pressed at");
			console.log(event);
			x=2*event.clientX/canvas.width-1;
            y=2*(canvas.height-event.clientY)/canvas.height-1;
            
            var pts = [x, y];
            vertices.push(pts);


            // TO DO
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
            
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index++, new Float32Array(pts));
           	index %= maxVertices;
			console.log(pts);
			// Maybe this re-renders pr mouseDown, but we gotta find out how to make positions dynamic pr click
			render();

		}
	}


	render();

 	function render(){
		gl.clear(gl.COLOR_BUFFER_BIT);
		//tjek at index ikke overskrider allokeret plads
		gl.drawArrays(gl.POINTS, 0, index);
		// skal kun bruges til animationer
		// window.requestAnimationFrame(render, canvas);
	}



}