// parameters are all in plot scale
var makePlot = function (canvas, sizex, sizey, originx, originy) {
    var that = {},
        context = canvas.getContext("2d"),
        
        graphToCanvasCoords = function (x, y) {
            var point = {x:x, y:y};
        
            point.x += originx;
            point.x *= canvas.width/sizex;
            
            point.y += originy;
            point.y *= canvas.height/sizey;
            point.y = canvas.height - point.y;
        
            return point;
        },
        
        canvasToGraphCoords = function (x, y) {
            var point = {x:x, y:y};
        
            point.x *= sizex/canvas.width;
            point.x -= originx;
            
            point.y = canvas.height - point.y;
            point.y *= sizey/canvas.height;
            point.y -= originy;
        
            return point;
        };
    
    that.moveTo = function (x, y) {
        var p = graphToCanvasCoords(x, y);
        context.moveTo(p.x, p.y);
    };
    
    that.lineTo = function (x, y) {
        var p = graphToCanvasCoords(x, y);
        context.lineTo(p.x, p.y);
    };
    
    that.arc = function (x, y, r, a, b, flag) {
        var p = graphToCanvasCoords(x, y);
        context.arc(p.x, p.y, r*canvas.width/sizex, a, b, flag);
    };
    
    that.stroke = function () { 
        context.lineWidth = that.lineWidth;
        context.strokeStyle = that.strokeStyle;
        context.stroke(); 
    };
    
    that.fill = function () { 
        context.fillStyle = that.fillStyle;
        context.fill(); 
    };
    
    that.beginPath = function () { context.beginPath(); };
    that.save = function () { context.save(); };
    that.restore = function () { context.restore(); };
    
    that.lineWidth = context.lineWidth;
    that.strokeStyle = context.strokeStyle;
    that.fillStyle = context.fillStyle;
    
    // extra methods
    
    that.plotPoint = function (x, y, r) {
        context.fillStyle = "black";
        context.beginPath();
        that.arc(x, y, r, 0, Math.PI*2, false);
        context.fill();
    };
    
    var buffer;
    
    that.restoreBuffer = function () {
        context.putImageData(buffer, 0, 0);
    };
    
    that.setBuffer = function () {
        buffer = context.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    that.setBuffer();
    
    that.drawAxis = function (xinc, yinc, xTickHeight, yTickHeight) {
        context.beginPath();
        
        that.moveTo(0, -sizey);
        that.lineTo(0, sizey);
        that.moveTo(-sizex, 0);
        that.lineTo(sizex, 0);
    
        var x, y;
    
        for (x = 0; x <= sizex; x += xinc) {
            that.moveTo(x, 0);
            that.lineTo(x, yTickHeight);
        }
    
        for (x = 0; x >= -sizex; x -= xinc) {
            that.moveTo(x, 0);
            that.lineTo(x, yTickHeight);
        }
    
        for (y = 0; y <= sizey; y += yinc) {
            that.moveTo(0, y);
            that.lineTo(xTickHeight, y);
        }
    
        for (y = 0; y >= -sizex; y -= yinc) {
            that.moveTo(0, y);
            that.lineTo(xTickHeight, y);
        }
    
        context.stroke();
    }

    return that;
};