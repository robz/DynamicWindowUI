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
    
    var drawEllipse = function (ctx, x, y, w, h) {
        var kappa = .5522848, // 4*(sqrt(2)-1)/3
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    };
    
    // we're ignoring a, b, and flag because it's hard to draw a partial ellipse
    // (we have to draw an ellipse because of possible scaling of the circle)
    that.arc = function (x, y, r, a, b, flag) {
        var p = graphToCanvasCoords(x, y),
            h = r*canvas.height/sizey,
            w = r*canvas.width/sizex;
        //drawEllipse(p.x - w/2, p.y - h/2, w, h);
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
    
    // these two functions ruin the illusion that we're a real context.
    //  they exist to make it more conveinent for a graphics object to 
    //  manipulate the background on a canvas.
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