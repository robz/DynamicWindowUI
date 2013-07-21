(function () {
    var DT = .1,
        V_MAX = .05,
        V_INC = V_MAX/5.0,
        DV_MAX = V_MAX/2.0,
        V_NUM_INCS = 9,
        V_SIZE = DT*2*DV_MAX,
        
        W_MAX = .002,
        W_INC = W_MAX/5.0,
        DW_MAX = W_MAX/2.0,
        W_NUM_INCS = 9,
        W_SIZE = DT*2*DW_MAX,
        
        KEY_W = "W".charCodeAt(0),
        KEY_A = "A".charCodeAt(0),
        KEY_S = "S".charCodeAt(0),
        KEY_D = "D".charCodeAt(0),
        KEY_SPACE = " ".charCodeAt(0),
        
        robotCanvas = document.getElementById("robotCanvas"),
        trajCanvas = document.getElementById("trajCanvas"),
        
        movingRobot = createRobot(
            robotCanvas.width/2.0,
            robotCanvas.height/2.0,
            0.0,
            0.0,
            0.0,
            20.0,
            "green"
            ),
            
        trajRobot = createRobot(
            trajCanvas.width/2.0,
            trajCanvas.height/2.0,
            movingRobot.pose.heading,
            movingRobot.v,
            movingRobot.w,
            movingRobot.radius,
            movingRobot.color
            ),
            
        trajGraphics = makeCanvasGraphics(trajRobot, trajCanvas);
        robotGraphics = makeCanvasGraphics(movingRobot, robotCanvas);
    
    Graph.setCanvas(document.getElementById("graphCanvas"));
    Graph.sizex = W_MAX*2;
    Graph.sizey = V_MAX*2;
    Graph.setInc(W_INC, V_INC);
    Graph.drawAxis();
    
    setInterval(function () {
        movingRobot.pose.step(1000*DT/2);
        robotGraphics.animate();
        
        Graph.clearCanvas();

        for (vi = 0; vi < V_NUM_INCS; vi++) {
            var v = movingRobot.pose.v + (vi - Math.floor(V_NUM_INCS/2))*V_SIZE/V_NUM_INCS;
            
            if (v > V_MAX || v < -V_MAX) {
                continue;
            }
                 
            for (wi = 0; wi < W_NUM_INCS; wi++) {
                var w = movingRobot.pose.w + (wi - Math.floor(W_NUM_INCS/2))*W_SIZE/W_NUM_INCS;
            
                if (w > W_MAX || w < -W_MAX) {
                    continue
                }
                    
                Graph.plotPoint(w, v);
            }
        }
    }, 1000*DT/2);
        
    document.onkeydown = function (event) {
        var pose = movingRobot.pose;
    
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