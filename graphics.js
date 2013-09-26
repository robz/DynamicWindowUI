var createGraphics = function (plot) {
    var that = {};
    
    var drawLine = function (x0, y0, x1, y1) {
        plot.beginPath();
        plot.moveTo(x0, y0);
        plot.lineTo(x1, y1);
    };
    
    var drawCircle = function (x, y, r) {
        plot.beginPath();
        plot.arc(x, y, r, 0, Math.PI*2, false);
        plot.closePath();
    };
    
    that.graphToCanvasCoords = plot.graphToCanvasCoords;
    that.canvasToGraphCoords = plot.canvasToGraphCoords;
	
	that.drawObstacles = function (obstacles, r) {
        plot.save();
		
		for (var i = 0; i < obstacles.length; i++) {
			that.plotPoint(obstacles[i].x, obstacles[i].y, 1.0, "darkBlue");
		}
		
		plot.restore();
	};
    
    that.drawRobot = function (robot) {
        plot.save();
    
        plot.strokeStyle = "darkGray";
        plot.fillStyle = robot.color;
        plot.lineWidth = 2;

        plot.closePath();
        drawCircle(robot.pose.x, robot.pose.y, robot.radius);
        plot.stroke();
        plot.fill();
        
        drawLine(
            robot.pose.x, 
            robot.pose.y,
            robot.pose.x + robot.radius * Math.cos(robot.pose.heading),
            robot.pose.y + robot.radius * Math.sin(robot.pose.heading)
            );
        plot.stroke();
        
        plot.restore();
    };
    
    that.drawTrajectories = function (trajs) {
        plot.save();
        
        for (var i = 0; i < trajs.length; i++) {
            if (trajs[i].isCurrent) {
                plot.strokeStyle = plot.fillStyle = "red";
                plot.lineWidth = 3;
            } else if (trajs[i].v < 0) {
                plot.strokeStyle = plot.fillStyle = "blue";
                plot.lineWidth = 1.5;
            } else {
                plot.strokeStyle = plot.fillStyle = "black";
                plot.lineWidth = 1;
            }
            
            switch (trajs[i].type) {
                case "line":
                    drawLine(
                        trajs[i].x, 
                        trajs[i].y,
                        trajs[i].x + 1e6*Math.cos(trajs[i].theta), 
                        trajs[i].y + 1e6*Math.sin(trajs[i].theta)
                        );
                    plot.stroke();
                    break;
                case "arc":
                    drawCircle(trajs[i].x, trajs[i].y, trajs[i].radius);
                    plot.stroke();
                    break;
                case "point":
                    drawCircle(trajs[i].x, trajs[i].y, 1);
                    plot.fill();
                    break;
            }
        }
        
        plot.restore();
    }
    
    that.drawGrid = function (xinc, yinc) {
        var sizex = plot.sizex,
            sizey = plot.sizey;
			
        plot.save();

        plot.strokeStyle = "darkGray";
        plot.beginPath();
    
        var x, y;
    
        for (x = 0; x <= sizex; x += xinc) {
            plot.moveTo(x, -sizey);
            plot.lineTo(x, sizey);
        }
    
        for (x = 0; x >= -sizex; x -= xinc) {
            plot.moveTo(x, -sizey);
            plot.lineTo(x, sizey);
        }
    
        for (y = 0; y <= sizey; y += yinc) {
            plot.moveTo(-sizex, y);
            plot.lineTo(sizex, y);
        }
    
        for (y = 0; y >= -sizey; y -= yinc) {
            plot.moveTo(-sizex, y);
            plot.lineTo(sizex, y);
        }
    
        plot.stroke();
		
		plot.restore();
    }
    
    that.drawAxis = function (xinc, yinc, xTickHeight, yTickHeight) {
        var sizex = plot.sizex,
            sizey = plot.sizey;
			
        plot.save();
        
        plot.beginPath();
        
        plot.moveTo(0, -sizey);
        plot.lineTo(0, sizey);
        plot.moveTo(-sizex, 0);
        plot.lineTo(sizex, 0);
    
        var x, y;
    
        for (x = 0; x <= sizex; x += xinc) {
            plot.moveTo(x, 0);
            plot.lineTo(x, yTickHeight);
        }
    
        for (x = 0; x >= -sizex; x -= xinc) {
            plot.moveTo(x, 0);
            plot.lineTo(x, yTickHeight);
        }
    
        for (y = 0; y <= sizey; y += yinc) {
            plot.moveTo(0, y);
            plot.lineTo(xTickHeight, y);
        }
    
        for (y = 0; y >= -sizey; y -= yinc) {
            plot.moveTo(0, y);
            plot.lineTo(xTickHeight, y);
        }
    
        plot.stroke();
		
		plot.restore();
    };
    
	that.plotLine = function (x1, y1, x2, y2, w, color) {
        plot.save();
		
		plot.lineWidth = w || 1;
        plot.strokeStyle = color || "black";
        drawLine(x1, y1, x2, y2);
        plot.stroke();
		
		plot.restore();
    };
	
    that.plotPoint = function (x, y, r, color) {
        plot.save();
		
        plot.fillStyle = color || "black";
        drawCircle(x, y, r);
        plot.fill();
		
		plot.restore();
    };
    
    var buffer;
    
    that.restoreBuffer = function () {
        plot.putBuffer(buffer);
    };
    
    that.setBuffer = function () {
        buffer = plot.getBuffer();
    };
    
    return that;
};
