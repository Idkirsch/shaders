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
    var index = 0;
    // var numPoints = 0;
    var points = [];
    var triangles = [];
    var circles = [];
    var beziers = [];
    var vertexs = []; // This array is hopefully kept up to date so it reflects whats in the buffer
    var vertexsForTheBuffer = []; // this array is filled and cleared often, so it only holds what should be pushed to the buffer in that round
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

    // var indexCount = 0;
    var count = 0;
    var numberOfSubdivCircle = 60;
    var numberofSubdivCurve = 4;
    var center = [];
    var p0 = [];
    var p1 = [];
    var p2 = [];

    canvas.addEventListener("click", function (ev) {
        var bbox = ev.target.getBoundingClientRect();
        vertexsForTheBuffer = [];
        newestVertex = vec2(2 * (ev.clientX - bbox.left) / canvas.width - 1, 2 * (canvas.height - ev.clientY + bbox.top - 1) / canvas.height - 1);
        // console.log("newestVertex : "+newestVertex);
        vertexs.push(newestVertex);
        vertexsForTheBuffer.push(newestVertex);
        points.push(index); // PUSHING AN INDEX TO POINTS
        console.log("index number "+ index+ " is pushed to points");
        // console.log(" I AM NOW DRAWING POINTS")

        if (pointMode) {
            console.log(" I AM NOW DRAWING POINTS")
            count = 0;
        }

        if (triangleMode) {
            console.log(" I AM NOW DRAWING TRIANGLES")
            count++;
            if (count == 3) {
                points.pop();
                points.pop();
                triangles.push(points.pop());
                count = 0;
            }
        }

        // if (circleMode) {
        //     count++;
        //     if (count == 1) {
        //         center = vertexs;
        //     }
        //     if (count == 2) {
        //         var outer = vertexs;
        //         points.pop();

        //         circles.push(points.pop());

        //         var radius = Math.sqrt(Math.pow(center[0] - outer[0], 2) + Math.pow(center[1] - outer[1], 2));
                
        //         vertexs.pop();
        //         vertexs.pop();
                
                
        //         for (let i = 0; i <= numberOfSubdivCircle; i++) {
        //             var theta = 2 * Math.PI * i / numberOfSubdivCircle;
        //             var vert1 = center[0] + radius * Math.cos(theta);
        //             vertexs.push(vert1);
        //             var vert2 = center[1] + radius * Math.sin(theta);
        //             vertexs.push(vert2);
        //             drawColor.push(colors[drawMenu.selectedIndex]);
        //             index++;
        //         }
        //         count = 0;
        //         // indexCount += numberOfSubdivCircle + 1;
        //     }
        //     console.log(" I AM NOW DRAWING CIRCLES")
        // }

        // if (bezierMode) {
        //     count++;
        //     if (count == 1) {
        //         p0 = newestVertex;
        //         console.log("p0: "+p0);
        //         console.log(" p0 again?  "+ newestVertex)
        //         console.log("vertexs: "+vertexs);
        //     }
        //     if (count == 2) {
        //         p2 = newestVertex;
        //     }
        //     if (count == 3) {
        //         p1 = newestVertex;
        //         points.pop();
        //         points.pop();
        //         beziers.push(points.pop());
        //         // vertexs = [];

        //         for (let i = 0; i <= numberofSubdivCurve; i++) {
        //             t = i / numberofSubdivCurve;
        //             bx = p1[0] + Math.pow(1 - t, 2) * (p0[0] - p1[0]) + Math.pow(t, 2) * (p2[0] - p1[0]);
        //             by = p1[1] + Math.pow(1 - t, 2) * (p0[1] - p1[1]) + Math.pow(t, 2) * (p2[1] - p1[1]);
        //             vertexs.push(vec2(bx, by));
        //             drawColor.push(colors[drawMenu.selectedIndex]);
        //             index++;
        //         }
        //         count = 0;

        //     }
        //     console.log(" I AM NOW DRAWING CURVES")
        // }

        // console.log("vertexs: "+vertexs);
        //position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec2'], flatten(vertexsForTheBuffer));
        //color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec4'], flatten(drawColor));
        index++;


        render();
    });




    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        for (i = 0; i < points.length; i++) {
            gl.drawArrays(gl.POINTS, points[i], 1); 
            // console.log("points: "+points);
            // console.log("HELLO FROM RENDERING POINTS. "+points[i]);
            // console.log("vertexs: "+vertexs);
        }

        for (i = 0; i < triangles.length; i++) {
            gl.drawArrays(gl.TRIANGLES, triangles[i], 3);
        }

        for (i = 0; i < circles.length; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, circles[i], numberOfSubdivCircle + 2);
            console.log("circles: "+circles);
        }

        for (i = 0; i < beziers.length; i++) {
            gl.drawArrays(gl.LINE_STRIP, beziers[i], numberofSubdivCurve + 3);
            console.log("beziers: "+beziers)
        }

        
    }
   
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
        bezierMode - false;
    });

    triangleButton.addEventListener("click", function (event) {
        pointMode = false;
        triangleMode = true;
        circleMode = false;
        bezierMode - false;
    })

    circleButton.addEventListener("click", function (event) {
        pointMode = false;
        triangleMode = false;
        circleMode = true;
        bezierMode - false;
    })

    curveButton.addEventListener("click", function (event) {
        circleMode = false;
        triangleMode = false;
        pointMode = false;
        bezierMode = true
    })
    /////////////////////////////////////////
}
