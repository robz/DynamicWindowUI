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
	
	that.euclid = function (p) {
		return Math.sqrt((p.x - that.x)*(p.x - that.x) + (p.y - that.y)*(p.y - that.y));
	}
    
    return that;
};
