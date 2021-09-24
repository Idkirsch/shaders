window.onload = function init(){


	var canvas = document.getElementById("c");
	var index = 0;
	var points = [];

	var gl = canvas.getContext("webgl"); 
	gl.clearColor(0.1, 0.5843, 0.9294, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT); 

	

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
 	gl.useProgram(program);
 	var vertices = [ vec2(0.0, 0.5), vec2(-0.5, -0.5), vec2(0.5, -0.5) ];
 	var vBuffer = gl.createBuffer();
 	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
 	var vPosition = gl.getAttribLocation(program, "a_Position");
 	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vPosition);
	
	
 	//gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
 	canvas.addEventListener("mousedown", MouseDown, false);
    var idx = 0;
	function MouseDown(event){
		//console.log(event);
		if(0 === event.button){
			console.log("left mouse button pressed")
			 x=2*event.clientX/canvas.width-1;
                y=2*(canvas.height-event.clientY)/canvas.height-1;
                var pts = [x, y];
                points.push(pts);

                gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);                                       
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*index++, new Float32Array(pts));
                console.log("index: "+index);
		}
	}

	//somehow it only works correctly with three points- the fourht is offset and then it stops drawing


 	render();

 	function render(){
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.POINTS, 0, index);
		window.requestAnimationFrame(render, canvas);
	}

}



