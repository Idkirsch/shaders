// okay, so this needs to be braided into my code from last week


window.onload = function init(){


var canvas = document.getElementById("c");
var gl = canvas.getContext("webgl"); 

console.log("tjek")

// get the storage locations of attribute and uniform variables
var program = initShaders(gl, "vertex-shader", "fragment-shader");
gl.useProgram(program);


program.a_Position = gl.getAttribLocation(program, 'a_Position');
program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
program.a_Color = gl.getAttribLocation(program, 'a_Color');

// step 1: Prepare empty buffer objects for vertex coordinates, colors, and normals
var model = initVertexBuffers(gl, program);


readOBJFile('../monkey/untitled.obj', gl, model, 60, true);



draw(gl, gl.program, currentAngle, viewProjMatrix, model);

}

// function initObject(gl, obj_filename, scale)
// {
// 	gl.program.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
// 	gl.program.a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
// 	gl.program.a_Color = gl.getAttribLocation(gl.program, 'a_Color');

// 	// Prepare empty buffer objects for vertex coordinates, colors, and normals
// 	var model = initVertexBuffers(gl);
	
// 	// Start reading the OBJ file
// 	readOBJFile(obj_filename, gl, model, scale, true);
// 	return model;
// }



// Create a buffer object and perform the initial configuration
function initVertexBuffers(gl, program) {
    var o = new Object();
    o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
    o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
    o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
    o.indexBuffer = gl.createBuffer();
//...
    return o;
}

// Create a buffer object, assign it to attribute variables, and enable the
function createEmptyArrayBuffer(gl, a_attribute, num, type) {
    var buffer = gl.createBuffer(); // Create a buffer object
//...
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute); // Enable the assignment

    return buffer;
}

// Read a file
function readOBJFile(fileName, gl, model, scale, reverse) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 404) {
            onReadOBJFile(request.responseText, fileName, gl, model, scale, reverse);
        }
    }
    request.open('GET', fileName, true); // Create a request to get file
    request.send(); // Send the request
}

var g_objDoc = null; // The information of OBJ file
var g_drawingInfo = null; // The information for drawing 3D model

// OBJ file has been read
function onReadOBJFile(fileString, fileName, gl, o, scale, reverse) {
    var objDoc = new OBJDoc(fileName); // Create a OBJDoc object
    var result = objDoc.parse(fileString, scale, reverse);
    if (!result) {
        g_objDoc = null; g_drawingInfo = null;
        console.log("OBJ file parsing error.");
        return;
    }
    g_objDoc = objDoc;
}