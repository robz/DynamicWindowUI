var createRobot = (function () {
    var createRobotPose = function (x, y, heading, v, w) {
        var that = {
            x: x,
            y: y,
            heading: heading,
            v: v,
            w: w
            };

        that.step = function (dt) {
            var new_x, new_y, new_heading;

            if (Math.abs(that.w) < 1.0e-6) {
                new_x = that.x + dt * that.v * Math.cos(that.heading);
                new_y = that.y + dt * that.v * Math.sin(that.heading);
                new_heading = that.heading;
            } else {
                var wd = dt * that.w,
                    R = that.v / that.w;

                new_x = that.x + R * Math.sin(wd + that.heading) - R * Math.sin(that.heading);
                new_y = that.y - R * Math.cos(wd + that.heading) + R * Math.cos(that.heading);   
                new_heading = that.heading + wd;
                new_heading = (new_heading + Math.PI*2)%(Math.PI*2)
            }

            that.x = new_x;
            that.y = new_y;
            that.heading = new_heading;
        };

        return that;
    };

    return function (x, y, heading, v, w, radius, color) {
        var that = {
            pose: createRobotPose(x, y, heading, v, w),
            radius: radius,
            color: color
            };
        
        return that;
    };
}());
