var calculateAndPlotTrajectories = function (pose, trajPose, plot) {
    var trajectories = [];
    
    plot && plot.restoreBuffer();

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
            
            plot && plot.plotPoint(w, v, V_INC/3);
            
            if (Math.abs(w) < 1.0e-6 && Math.abs(v) < 1.0e-6) {
                var trajectory = {
                    type: "point",
                    v: 0,
                    w: 0,
                    x: trajPose.x,
                    y: trajPose.y
                    };
            } else if (Math.abs(w) < 1.0e-6) {
                var trajectory = {
                    type: "line",
                    v: v,
                    w: 0,
                    x: trajPose.x,
                    y: trajPose.y,
                    theta: (v >= 0) ? trajPose.heading : Math.PI + trajPose.heading
                    };
            } else {
                var R = v/w;
            
                var trajectory = {
                    type: "arc",
                    v: v,
                    w: w,
                    x: trajPose.x - R * Math.sin(trajPose.heading),
                    y: trajPose.y + R * Math.cos(trajPose.heading),
                    radius: Math.abs(R)
                    }; 
            }
            
            if (wi === Math.floor(W_NUM_INCS/2) && vi === Math.floor(V_NUM_INCS/2)) {
                trajectory.isCurrent = true;
            }
            
            trajectories.push(trajectory);
        }
    }
            
    return trajectories;
};
