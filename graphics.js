var makeCanvasGraphics = function (robot, canvas) {
    var that = {};
    
    that.context = canvas.getContext("2d");
    
    var bgBuffer = that.context.getImageData(0, 0, canvas.width, canvas.height);
    
    var clearCanvas = function () {
        if (!canvas) {
            return false;
        }
        
        that.context.putImageData(bgBuffer, 0, 0);
        
        return true;
    };
    
    var drawRobot = function () {
        var context = that.context;
        
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
        
        return true;
    };
    
    var drawTrajectories = function () {
        if (!that.trajs) {
            return;
        }
        
        context.strokeStyle = context.fillStyle = "black";
        context.lineWidth = 2;
        
        for (var i = 0; i < trajs.length; i++) {
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
    }
    
    that.animate = function (dt) {
        clearCanvas();
        drawRobot();
        drawTrajectories();
        
        return true;
    };
    
    return that;
};


















































