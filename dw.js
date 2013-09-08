var createTrajectory = function (v, w, refPose) {
    var that = {
        type: "(unknown)",
        v: null,
        w: null,
        x: null,
        y: null,
        theta: null,
        radius: null,
        isCurrent: false
        };

    if (Math.abs(w) < 1.0e-6 && Math.abs(v) < 1.0e-6) {
        that.type = "point";
        that.v = 0;
        that.w = 0;
        that.x = refPose.x; 
        that.y = refPose.y;
    } else if (Math.abs(w) < 1.0e-6) {
        that.type = "line";
        that.v = v;
        that.w = 0;
        that.x = refPose.x;
        that.y = refPose.y;
        that.theta = (v >= 0) ? refPose.heading : Math.PI + refPose.heading;
    } else {
        var R = v/w;

        that.type = "arc";
        that.v = v;
        that.w = w;
        that.x = refPose.x - R * Math.sin(refPose.heading);
        that.y = refPose.y + R * Math.cos(refPose.heading);
        that.radius = Math.abs(R);
    }
    
    return that;
};

var calculateTrajectories = function (pose, refPose) {
    var trajectories = [];

    for (vi = 0; vi < V_NUM_INCS; vi++) {
        var v = pose.v + (vi - Math.floor(V_NUM_INCS/2))*V_INC;
        
        if (v > V_MAX || v < -V_MAX) {
            continue;
        }
        
        for (wi = 0; wi < W_NUM_INCS; wi++) {
            var w = pose.w + (wi - Math.floor(W_NUM_INCS/2))*W_INC;
        
            if (w > W_MAX || w < -W_MAX) {
                continue;
            }
            
            var trajectory = createTrajectory(v, w, refPose);

            if (wi === Math.floor(W_NUM_INCS/2) && vi === Math.floor(V_NUM_INCS/2)) {
                trajectory.isCurrent = true;
            }

            trajectories.push(trajectory);
        }
    }
            
    return trajectories;
};
