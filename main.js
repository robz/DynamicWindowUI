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
            radius: ROBOT_RADIUS,
            color: "green",
            name: "world"
            }),

        localRobot = createRobot({
            x: 0.0,
            y: 0.0,
            heading: 0.0,
            v: 0.0,
            w: 0.0,
            radius: worldRobot.radius,
            color: worldRobot.color,
            name: "local"
            }),
            
        worldCanvas = document.getElementById("worldCanvas"),

        worldGraphics = createGraphics(createPlot(
            worldCanvas, 
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
            )),
            
        goal = new Point({x:35.0, y:0.0}),
        obstacles = [];
	
	
	for (var i = 0; i < 50; i++) {
		obstacles.push(new Point({
			x: Math.random()*100-50,
			y: Math.random()*100-50
			}));
	}
	

    // set all the canvas' backgrounds
    worldGraphics.drawGrid(10, 10);
    worldGraphics.setBuffer();
    localGraphics.drawGrid(10, 10);
    localGraphics.drawRobot(localRobot);
    localGraphics.setBuffer();
    dwGraphics.drawAxis(W_INC, V_INC, W_INC/2.0, V_INC/2.0);
    dwGraphics.setBuffer();
    
    var trajectories = [];
    
    var decision = {v:0, w:0};
    
    var localGoal = goal.transform(
            -worldRobot.pose.x,
            -worldRobot.pose.y,
            -worldRobot.pose.heading
            );
			
	
    // start a loop to make decisions on how the robot should move
    //  (this pretends to be the main loop running on the robot's processor) 
    setInterval(function () {
        // calculate the available trajectories in the local reference frame
        trajectories = DW.calcTrajectories(
            worldRobot.pose,
            localRobot.pose
            );

        // move the goal & obstacle points into the local reference frame
        localGoal = goal.transform(
            -worldRobot.pose.x,
            -worldRobot.pose.y,
            -worldRobot.pose.heading
            );
			
		var localObstacles = [];
		for (var i = 0; i < obstacles.length; i++) {
			localObstacles.push(obstacles[i].transform(
				-worldRobot.pose.x,
				-worldRobot.pose.y,
				-worldRobot.pose.heading
				));
		}

        // copy the current angular and linear velocity to our local pose
        localRobot.pose.v = worldRobot.pose.v;
        localRobot.pose.w = worldRobot.pose.w;
        
        // make a decision based on current pose, goal, available trajectories,
        //  and detected obstacle points
        decision = DW.calcDecision(
            localRobot.pose, 
            localGoal, 
            trajectories, 
            localObstacles,
            DECISION_LOOKAHEAD
            );
            
        // set the new pose to reflect the decision
        worldRobot.pose.v = decision.v;
        worldRobot.pose.w = decision.w;
        
        // plot the trajectory (w,v) pairs as points on the graph
        dwGraphics.restoreBuffer();
		
        for (var i = 0; i < trajectories.length; i++) {
            dwGraphics.plotPoint(
                trajectories[i].w,
                trajectories[i].v,
                V_INC/3 // kinda arbitrary
                );
        }
    }, DECISION_TIME_STEP*1000);
    
    // start a loop to update & draw the robot's pose
    //  (this pretends to do what the real world would do to the robot)
    setInterval(function () {
        // move our robot forward in time
        worldRobot.step(SIMULATION_TIME_STEP);

        // move the goal & obstacle points into the local reference frame
        localGoal = goal.transform(
            -worldRobot.pose.x,
            -worldRobot.pose.y,
            -worldRobot.pose.heading
            );
		
		var localObstacles = [];
		for (var i = 0; i < obstacles.length; i++) {
			localObstacles.push(obstacles[i].transform(
				-worldRobot.pose.x,
				-worldRobot.pose.y,
				-worldRobot.pose.heading
				));
		}
        
        // draw the trajectories on the local canvas
        localGraphics.restoreBuffer();
        localGraphics.drawTrajectories(trajectories);

        // recalculate the current trajectory in the global reference frame,
        //  and then draw it on the global canvas
        worldGraphics.restoreBuffer();
        worldGraphics.drawTrajectories([DW.createTrajectory(
            decision.v,
            decision.w,
            worldRobot.pose
            )]);

        // finally, draw the current robot on the world canvas
        worldGraphics.drawRobot(worldRobot);
        
        // draw the goal & obstacles in the world frame
        worldGraphics.plotPoint(goal.x, goal.y, 1.0);
		worldGraphics.drawObstacles(obstacles, worldRobot.radius);
		
		// then draw them in the local frame
        localGraphics.plotPoint(localGoal.x, localGoal.y, 1.0);
		localGraphics.drawObstacles(localObstacles, worldRobot.radius);
    }, SIMULATION_TIME_STEP*1000);
    

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
    
    worldCanvas.onmousedown = function (e) {
        var mouseX, mouseY;

        if (e.offsetX) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        } else if (e.layerX) {
            mouseX = e.layerX;
            mouseY = e.layerY;
        }

        var res = worldGraphics.canvasToGraphCoords(mouseX, mouseY);
        
        goal.x = res.x;
        goal.y = res.y;
    };
}());
