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
        return p;
    };
    
    return that;
};