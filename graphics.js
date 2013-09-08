var makeGraphics = function (context) {
    var that = {};
    
    that.context = context;
    
    that.drawRobot = function (robot) {
        context.save();
    
        context.strokeStyle = "darkGray";
        context.fillStyle = robot.color;
        context.lineWidth = 2;

        context.beginPath();
        context.arc(robot.pose.x, robot.pose.y, robot.radius, 0, 2*Math.PI, false);
        context.closePath();
        context.stroke();
        context.fill();
        
        context.beginPath();
        context.moveTo(robot.pose.x, robot.pose.y);
        context.lineTo(robot.pose.x + robot.radius * Math.cos(robot.pose.heading),
                       robot.pose.y + robot.radius * Math.sin(robot.pose.heading));
        context.closePath();
        context.stroke();
        
        context.restore();
    };
    
    that.drawTrajectories = function (trajs) {
        context.save();
        
        for (var i = 0; i < trajs.length; i++) {
            if (trajs[i].isCurrent) {
                context.strokeStyle = context.fillStyle = "red";
                context.lineWidth = 3;
            } else if (trajs[i].v < 0) {
                context.strokeStyle = context.fillStyle = "blue";
                context.lineWidth = 1.5;
            } else {
                context.strokeStyle = context.fillStyle = "black";
                context.lineWidth = 1;
            }
            
            switch (trajs[i].type) {
                case "line":
                    context.beginPath();
                    context.moveTo(trajs[i].x, trajs[i].y);
                    context.lineTo(trajs[i].x + 1e6*Math.cos(trajs[i].theta), 
                                   trajs[i].y + 1e6*Math.sin(trajs[i].theta));
                    context.closePath();
                    context.stroke();
                    break;
                case "arc":
                    context.beginPath();
                    context.arc(trajs[i].x, trajs[i].y, trajs[i].radius, 0, 2*Math.PI, false);
                    context.closePath();
                    context.stroke();
                    break;
                case "point":
                    context.beginPath();
                    context.arc(trajs[i].x, trajs[i].y, 1, 0, 2*Math.PI, false);
                    context.closePath();
                    context.fill();
                    break;
            }
        }
        
        context.restore();
    }
    
    that.drawAxis = function (xinc, yinc, xTickHeight, yTickHeight) {
        var sizex = context.sizex,
            sizey = context.sizey;
        
        context.beginPath();
        
        context.moveTo(0, -sizey);
        context.lineTo(0, sizey);
        context.moveTo(-sizex, 0);
        context.lineTo(sizex, 0);
    
        var x, y;
    
        for (x = 0; x <= sizex; x += xinc) {
            context.moveTo(x, 0);
            context.lineTo(x, yTickHeight);
        }
    
        for (x = 0; x >= -sizex; x -= xinc) {
            context.moveTo(x, 0);
            context.lineTo(x, yTickHeight);
        }
    
        for (y = 0; y <= sizey; y += yinc) {
            context.moveTo(0, y);
            context.lineTo(xTickHeight, y);
        }
    
        for (y = 0; y >= -sizey; y -= yinc) {
            context.moveTo(0, y);
            context.lineTo(xTickHeight, y);
        }
    
        context.stroke();
    };
    
    that.plotPoint = function (x, y, r) {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI*2, false);
        context.closePath();
        context.fill();
    };
    
    var buffer;
    
    that.restoreBuffer = function () {
        context.putBuffer(buffer);
    };
    
    that.setBuffer = function () {
        buffer = context.getBuffer();
    };
    
    return that;
};


















































