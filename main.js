(function () {
    var KEY_W = "W".charCodeAt(0),
        KEY_A = "A".charCodeAt(0),
        KEY_S = "S".charCodeAt(0),
        KEY_D = "D".charCodeAt(0),
        KEY_SPACE = " ".charCodeAt(0),

        worldRobot = createRobot({
            x: 0.0,
            y: 0.0,
            heading: 0.0,
            v: 0.0,
            w: 0.0,
            radius: 5.0,
            color: "green",
            name: "world"
            }),

        localRobot = createRobot({
            x: 0.0,
            y: 0.0,
            heading: worldRobot.pose.heading,
            v: worldRobot.pose.v,
            w: worldRobot.pose.w,
            radius: worldRobot.radius,
            color: worldRobot.color,
            name: "local"
            }),

        worldGraphics = createGraphics(createPlot(
            document.getElementById("worldCanvas"), 
            100.0, 
            100.0, 
            50.0, 
            50.0
            )),

        localGraphics = createGraphics(createPlot(
            document.getElementById("localCanvas"), 
            100.0, 
            100.0, 
            50.0, 
            50.0
            )),

        dwGraphics = createGraphics(createPlot(
            document.getElementById("plotCanvas"), 
            W_MAX*2, 
            V_MAX*2, 
            W_MAX, 
            V_MAX
            ));

    // set all the canvas' backgrounds
    worldGraphics.setBuffer();
    localGraphics.drawRobot(localRobot);
    localGraphics.setBuffer();
    dwGraphics.drawAxis(W_INC, V_INC, W_INC, V_INC);
    dwGraphics.setBuffer();

    setInterval(function () {
        // move our robot forward in time
        worldRobot.step(1000*DT);

        // cacluate the trajectories in the local reference frame
        var trajectories = calculateTrajectories(
            worldRobot.pose,
            localRobot.pose
            );

        // plot the trajectory (w,v) pairs as points on the graph
        dwGraphics.restoreBuffer();
        for (var i = 0; i < trajectories.length; i++) {
            dwGraphics.plotPoint(
                trajectories[i].w,
                trajectories[i].v,
                V_INC/3 // kinda arbitrary
                );
        }

        // draw the trajectories on the local canvas
        localGraphics.restoreBuffer();
        localGraphics.drawTrajectories(trajectories);

        // recalculate the current trajectory in the global reference frame,
        //  and then draw it on the global canvas
        worldGraphics.restoreBuffer();
        for (var i = 0; i < trajectories.length; i++) {
            if (trajectories[i].isCurrent) {
                worldGraphics.drawTrajectories([createTrajectory(
                    trajectories[i].v,
                    trajectories[i].w,
                    worldRobot.pose
                    )]);
            }
        }

        // finally, draw the current robot on the world canvas
        worldGraphics.drawRobot(worldRobot);
    }, 1000*DT);

    // handle keyboard input that controls the angular and linear velocity of 
    //  the robot, while respecting angular and linear velocity bounds
    document.onkeydown = function (event) {
        var pose = worldRobot.pose;

        switch (event.which) {
            case KEY_W:
                pose.v += V_INC;
                break;
            case KEY_A:
                pose.w += W_INC;
                break;
            case KEY_S:
                pose.v -= V_INC;
                break;
            case KEY_D:
                pose.w -= W_INC;
                break;
            case KEY_SPACE:
                pose.v = pose.w = 0;
                break;    
        }

        if (pose.w > W_MAX) {
            pose.w = W_MAX;
        } else if (pose.w < -W_MAX) {
            pose.w  = -W_MAX;
        }

        if (pose.v > V_MAX) {
            pose.v = V_MAX;
        } else if (pose.v < -V_MAX) {
            pose.v = -V_MAX;
        }
    };
}());
