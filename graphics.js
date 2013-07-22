var makeCanvasGraphics = function (canvas) {
    var that = {},
        context = canvas.getContext("2d"),
        bgBuffer;
    
    that.setBackground = function () {
        bgBuffer = context.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    that.clearCanvas = function () {
        context.putImageData(bgBuffer, 0, 0);
    };
    
    that.drawRobot = function (robot) {
        context.save();
    
        context.strokeStyle = "darkGray";
        context.fillStyle = robot.color;
        context.lineWidth = 2;

        context.beginPath();
        context.arc(robot.pose.x, robot.pose.y, robot.radius, 0, 2*Math.PI, false);
        context.stroke();
        context.fill();
        
        context.beginPath();
        context.moveTo(robot.pose.x, robot.pose.y);
        context.lineTo(robot.pose.x + robot.radius * Math.cos(robot.pose.heading),
                       robot.pose.y + robot.radius * Math.sin(robot.pose.heading));
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
                context.stroke();
                break;
            case "arc":
                context.beginPath();
                context.arc(trajs[i].x, trajs[i].y, trajs[i].radius, 0, 2*Math.PI, false);
                context.stroke();
                break;
            case "point":
                context.beginPath();
                context.arc(trajs[i].x, trajs[i].y, 5, 0, 2*Math.PI, false);
                context.fill();
                break;
            }
        }
        
        context.restore();
    }
    
    return that;
};


















































