var createPoint = function (spec) {
    var that = {
        x: spec.x,
        y: spec.y
        };
    
    that.copy = function () {
        return createPoint(that);
    };
    
    that.transform = function (dx, dy, dtheta) {
        var p = that.copy();
        p.x = (that.x + dx) * Math.cos(dtheta) - (that.y + dy) * Math.sin(dtheta);
        p.y = (that.x + dx) * Math.sin(dtheta) + (that.y + dy) * Math.cos(dtheta);
        return p;
    };
    
    return that;
};
