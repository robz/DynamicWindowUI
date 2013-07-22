(function () {
    var KEY_W = "W".charCodeAt(0),
        KEY_A = "A".charCodeAt(0),
        KEY_S = "S".charCodeAt(0),
        KEY_D = "D".charCodeAt(0),
        KEY_SPACE = " ".charCodeAt(0),
        
        worldCanvas = document.getElementById("worldCanvas"),
        localCanvas = document.getElementById("localCanvas"),
        
        worldRobot = createRobot(
            worldCanvas.width/2.0,
            worldCanvas.height/2.0,
            0.0,
            0.0,
            0.0,
            20.0,
            "green"
            ),
            
        localRobot = createRobot(
            localCanvas.width/2.0,
            localCanvas.height/2.0,
            worldRobot.pose.heading,
            worldRobot.pose.v,
            worldRobot.pose.w,
            worldRobot.radius,
            worldRobot.color
            ),
            
        worldGraphics = makeCanvasGraphics(worldCanvas),
        localGraphics = makeCanvasGraphics(localCanvas),
        
        plot = makePlot(document.getElementById("plotCanvas"), W_MAX*2, V_MAX*2, W_INC, V_INC);
    
    worldGraphics.setBackground();
    localGraphics.drawRobot(localRobot);
    localGraphics.setBackground();
    
    setInterval(function () {
        worldRobot.pose.step(1000*DT/2);

        var trajectories = calculateAndPlotTrajectories(
            worldRobot.pose,
            localRobot.pose, 
            plot
            );
        
        localGraphics.clearCanvas();
        localGraphics.drawTrajectories(trajectories);
        
        var trajectories = calculateAndPlotTrajectories(
            worldRobot.pose,
            worldRobot.pose, 
            null
            );
        
        worldGraphics.clearCanvas();
        for (var i = 0; i < trajectories.length; i++) {
            if (trajectories[i].isCurrent) {
                worldGraphics.drawTrajectories([trajectories[i]]);
            }
        }
        worldGraphics.drawRobot(worldRobot);
    }, 1000*DT/2);
        
    document.onkeydown = function (event) {
        var pose = worldRobot.pose;
    
        switch (event.which) {
            case KEY_W:
                pose.v += V_INC;
                break;
            case KEY_A:
                pose.w -= W_INC;
                break;
            case KEY_S:
                pose.v -= V_INC;
                break;
            case KEY_D:
                pose.w += W_INC;
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