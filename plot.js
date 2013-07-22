var makePlot = function (canvas, sizex, sizey, incx, incy) {
    var that = {},
        context = canvas.getContext("2d"),
        bgBuffer,
        inc = {
            x: incx * canvas.width/sizex,
            y: incy * canvas.height/sizey
        };
        
        graphToCanvasCoords = function (x, y) {
            var point = {x:x, y:y};
        
            point.x *= canvas.width/sizex;
            point.x += canvas.width/2.0;
            point.y *= canvas.height/sizey;
            point.y += canvas.height/2.0;
            point.y = canvas.height - point.y;
        
            return point;
        },
        
        canvasToGraphCoords = function (x, y) {
            var point = {x:x, y:y};
        
            point.x -= canvas.width/2.0;
            point.x *= sizex/canvas.width;
            point.y = canvas.height - point.y;
            point.y -= canvas.height/2.0;
            point.y *= sizey/canvas.height;
        
            return point;
        },
        
        drawAxis = function () {
            context.strokeStyle = "darkGray";
            context.lineWidth = 2;
        
            context.beginPath();
        
            context.moveTo(canvas.width/2.0, 0);
            context.lineTo(canvas.width/2.0, canvas.height);
            context.moveTo(0, canvas.height/2.0);
            context.lineTo(canvas.width, canvas.height/2.0);
        
            var x, y;
        
            for (x = canvas.width/2.0; x <= canvas.width; x += inc.x) {
                context.moveTo(x, canvas.height/2.0);
                context.lineTo(x, canvas.height/2.0 - 3);
            }
        
            for (x = canvas.width/2.0; x >= 0; x -= inc.x) {
                context.moveTo(x, canvas.height/2.0);
                context.lineTo(x, canvas.height/2.0 - 3);
            }
        
            for (y = canvas.height/2.0; y <= canvas.height; y += inc.y) {
                context.moveTo(canvas.width/2.0, y);
                context.lineTo(canvas.width/2.0 + 3, y);
            }
        
            for (y = canvas.height/2.0; y >= 0; y -= inc.y) {
                context.moveTo(canvas.width/2.0, y);
                context.lineTo(canvas.width/2.0 + 3, y);
            }
        
            context.stroke();
        };
    
    drawAxis();
    bgBuffer = context.getImageData(0, 0, canvas.width, canvas.height);
    
    that.clearCanvas = function () {
        context.putImageData(bgBuffer, 0, 0);
    };
    
    // expects x and y in graph coords
    that.plotPoint = function (x, y) {
        var point = graphToCanvasCoords(x, y);
        
        context.fillStyle = "black";
        context.beginPath();
        context.arc(point.x, point.y, 1, 0, Math.PI*2, false);
        context.fill();
    };
    
    return that;
};