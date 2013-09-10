// parameters are all in plot (not canvas) scale
var createPlot = function (canvas, sizex, sizey, originx, originy) {
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
        
    that.graphToCanvasCoords = graphToCanvasCoords;
    that.canvasToGraphCoords = canvasToGraphCoords;
    
    that.moveTo = function (x, y) {
        var p = graphToCanvasCoords(x, y);
        context.moveTo(p.x, p.y);
    };
    
    that.lineTo = function (x, y) {
        var p = graphToCanvasCoords(x, y);
        context.lineTo(p.x, p.y);
    };
    
    // since there isn't a 'drawEllipse' function of context, we can only draw
    //  circles, not ellipses. so we can't accurately show scaling that doesn't
    //  preserve the aspect ratio of the actual canvas.
    that.arc = function (x, y, r, a, b, flag) {
        var p = graphToCanvasCoords(x, y),
            h = r*canvas.height/sizey;
        
        context.arc(p.x, p.y, h, a, b, flag);
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
    that.closePath = function () { context.closePath(); };
    that.save = function () { context.save(); };
    that.restore = function () { context.restore(); };
    
    that.lineWidth = context.lineWidth;
    that.strokeStyle = context.strokeStyle;
    that.fillStyle = context.fillStyle;
    
    // the following members exist to make it more conveinent for a graphics 
    //  object to manipulate the background on a canvas and to implement drawAxis
    that.getBuffer = function () {
        return context.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    that.putBuffer = function (buffer) {
        context.putImageData(buffer, 0, 0);
    };
    
    that.sizex = sizex;
    that.sizey = sizey;

    return that;
};
