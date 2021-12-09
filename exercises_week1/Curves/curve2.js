function main() {
    var canvas = document.getElementById("gl-canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var max_verts = 1000;
    var index = 0;    var points = [];
    var triangles = [];
    var circles = [];
    var beziers = [];
    var vertexs = []; // This array is hopefully kept up to date so it reflects whats in the buffer
    var colors = [
        vec4(1.0, 0.0, 0.0, 1.0), // red
        vec4(0.0, 0.0, 0.0, 1.0), // black
        vec4(1.0, 1.0, 0.0, 1.0), // yellow
        vec4(0.0, 1.0, 0.0, 1.0), // green
        vec4(0.0, 0.0, 1.0, 1.0), // blue
        vec4(1.0, 0.0, 1.0, 1.0), // magenta
        vec4(0.0, 1.0, 1.0, 1.0) // cyan 
        ];

    var clearMenu = document.getElementById("clearMenu");
    var drawMenu = document.getElementById("drawMenu");
    var clearButton = document.getElementById("clearButton");
    var triangleButton = document.getElementById("triangleButton");
    var pointButton = document.getElementById("pointButton");
    var circleButton = document.getElementById("circleButton");

    var drawColor = [colors[drawMenu.selectedIndex]];
    var pointMode = false;
    var triangleMode = false;
    var circleMode = false;
    var bezierMode = false;

    var count = 0; // counter for keeping track of how many points are drawn in triangle, circle and curve
    var numberOfSubdivCircle = 30;  // smoothness of circle
    var numberofSubdivCurve = 30; // smoothness of curve
    var center = [];  // center of the circle
    var p0 = [];    // points for curve
    var p1 = [];
    var p2 = [];

    canvas.addEventListener("click", function (ev) {
        var bbox = ev.target.getBoundingClientRect();
  
        newestVertex = vec2(2 * (ev.clientX - bbox.left) / canvas.width - 1, 2 * (canvas.height - ev.clientY + bbox.top - 1) / canvas.height - 1);
       
        points.push(index); 

        if (pointMode) {
            count = 0;
        }

        if (triangleMode) {
            count++;
            if (count == 3) { // only draw triangle if the user input three consecutive points
                points.pop();
                points.pop();
                triangles.push(points.pop());
                count = 0;
            }
        }

        if (circleMode) {
            count++;
            if (count == 1) {
                center = newestVertex;
            }
            if (count == 2) { // only draw circle if user input two consecutive points
                drawCircle();
                count = 0; 
            }
        }

        if (bezierMode) {
            count++;
            if (count == 1) {
                p0 = newestVertex;
            }
            if (count == 2) {
                p2 = newestVertex;
            }
            if (count == 3) {
                p1 = newestVertex;
                drawCurve();
                count = 0;

            }
  
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec2'], flatten(newestVertex));
        //color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec4'], flatten(drawColor));
        index++;
        // console.log("index: "+index);


        render();
    });

       
    function drawCircle(){

        var outer = newestVertex;

        points.pop();
        circles.push(points.pop()); // putting the correct index in the array for circles

        var radius = Math.sqrt(Math.pow(center[0] - outer[0], 2) + Math.pow(center[1] - outer[1], 2));

        for (let i = 0; i <= numberOfSubdivCircle; i++) {

            var theta = 2 * Math.PI * i / numberOfSubdivCircle;
            var x = center[0] + radius * Math.cos(theta);
            var y = center[1] + radius * Math.sin(theta);
           
            var vertex = vec2(x,y);
            vertexs.push(vertex);

            drawColor.push(colors[drawMenu.selectedIndex]);

            // putting each vertex in the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec2'], flatten(vertex));
            //color buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec4'], flatten(drawColor));
            index++;

        }
      
    }    

    function drawCurve(){
        points.pop();
        points.pop();
        beziers.push(points.pop());

        for (let i = 0; i <= numberofSubdivCurve; i++) {
            console.log("i: "+i)
            t = i / numberofSubdivCurve;
            bx = p1[0] + Math.pow(1 - t, 2) * (p0[0] - p1[0]) + Math.pow(t, 2) * (p2[0] - p1[0]);
            by = p1[1] + Math.pow(1 - t, 2) * (p0[1] - p1[1]) + Math.pow(t, 2) * (p2[1] - p1[1]);
            var point = vec2(bx,by);
            vertexs.push(point);
            drawColor.push(colors[drawMenu.selectedIndex]);

            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec2'], flatten(point));
            //color buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec4'], flatten(drawColor));
            index++;
        }
    }




    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        for (i = 0; i < points.length; i++) {
            gl.drawArrays(gl.POINTS, points[i], 1); 
            console.log("points: "+points);
        }

        for (i = 0; i < triangles.length; i++) {
            gl.drawArrays(gl.TRIANGLES, triangles[i], 3);
            console.log("triangles: "+triangles);

        }

        for (i = 0; i < circles.length; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, circles[i], numberOfSubdivCircle + 2);
            console.log("circles: "+circles);
        }

        for (i = 0; i < beziers.length; i++) {
            gl.drawArrays(gl.LINE_STRIP, beziers[i], numberofSubdivCurve +3);
            console.log("beziers: "+beziers)
        }

        
    }
   
/////// initializing buffers for vertices and colors //////

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, max_verts * sizeof['vec2'], gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, max_verts * sizeof['vec4'], gl.STATIC_DRAW);

    var cPosition = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cPosition);



//////////BUTTONS & MENUS//////////////////////////////

    clearButton.addEventListener("click", function (event) {
        var bgcolor = colors[clearMenu.selectedIndex];
        gl.clearColor(bgcolor[0], bgcolor[1], bgcolor[2], bgcolor[3]);
        index = 0;
        // numPoints = 0;
        points = [];
        triangles = [];
        circles = [];
        beziers = [];
        count = 0;
    });

    drawMenu.addEventListener("click", function (event) {
        var dwcolor = colors[drawMenu.selectedIndex];
        drawColor = vec4(dwcolor[0], dwcolor[1], dwcolor[2], dwcolor[3]);
    });

    pointButton.addEventListener("click", function (event) {
        pointMode = true;
        triangleMode = false;
        circleMode = false;
        bezierMode = false;
    });

    triangleButton.addEventListener("click", function (event) {
        pointMode = false;
        triangleMode = true;
        circleMode = false;
        bezierMode = false;
    })

    circleButton.addEventListener("click", function (event) {
        pointMode = false;
        triangleMode = false;
        circleMode = true;
        bezierMode = false;
    })

    curveButton.addEventListener("click", function (event) {
        circleMode = false;
        triangleMode = false;
        pointMode = false;
        bezierMode = true
    })
    /////////////////////////////////////////
}
