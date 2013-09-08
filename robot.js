var createRobot = function (spec) {
    var pose = {
            x: spec.x,
            y: spec.y,
            heading: spec.heading,
            v: spec.v,
            w: spec.w
            };
    
    pose.step = function (dt) {
        var new_x, new_y, new_heading;

        if (Math.abs(pose.w) < 1.0e-6) {
            new_x = pose.x + dt * pose.v * Math.cos(pose.heading);
            new_y = pose.y + dt * pose.v * Math.sin(pose.heading);
            new_heading = pose.heading;
        } else {
            var wd = dt * pose.w,
                R = pose.v / pose.w;

            new_x = pose.x + R * Math.sin(wd + pose.heading) - R * Math.sin(pose.heading);
            new_y = pose.y - R * Math.cos(wd + pose.heading) + R * Math.cos(pose.heading);   
            new_heading = pose.heading + wd;
            new_heading = (new_heading + Math.PI*2)%(Math.PI*2)
        }

        pose.x = new_x;
        pose.y = new_y;
        pose.heading = new_heading;
    };

    return {
        pose: pose,
        radius: spec.radius,
        color: spec.color,
        name: spec.name
        };
};
