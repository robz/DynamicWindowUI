//
// Trajectory
//
			
var Trajectory = function (v, w, refPose) {
	// abstract class
};

Trajectory.prototype.calcHeadingValue = function (pose, goal, dt) {
	// follow this trajectory for dt seconds
	var newPose = pose.copy();
	newPose.v = this.v;
	newPose.w = this.w;
	newPose.step(dt);

	// calculate the new direction to the goal
	var dirToGoal = Math.atan2(goal.y - newPose.y, goal.x - newPose.x);

	// find the diff between the new goal direction and the new heading
	var diff = ((dirToGoal - newPose.heading) + 3*Math.PI) % (2*Math.PI) - Math.PI;

	// normalize (diff can't be larger than PI) and invert (higher values are better)
	return 1.0 - Math.abs(diff / Math.PI);
};

Trajectory.prototype.calcSpeedValue = function () {
	return (this.v + V_MAX) / (2*V_MAX);
};

Trajectory.prototype.calcClearanceValue = function (obstacles) {
	throw "method not implemented";
};


//
// PointTrajectory
//

var PointTrajectory = function (v, w, refPose) {
	this.v = 0;
    this.w = w;
    this.x = refPose.x; 
    this.y = refPose.y;
};

PointTrajectory.prototype = new Trajectory();

PointTrajectory.prototype.calcClearanceValue = function (obstacles) {
	return 1.0;
};;


//
// LineTrajectory
//

var LineTrajectory = function (v, w, refPose) {
	this.v = v;
	this.w = 0;
	this.x = refPose.x;
	this.y = refPose.y;
	this.theta = (v >= 0) ? refPose.heading : Math.PI + refPose.heading;
};

LineTrajectory.prototype = new Trajectory();

LineTrajectory.prototype.calcClearanceValue = function (obstacles) {
	var minValue = MAX_CLEARANCE_VALUE;
	
	var _this = this;
    
	obstacles.forEach(function(obstacle, index, array) {
		if (obstacle.euclid(_this) < DECISION_RADIUS) {
			return;
		}
	
		if (obstacle.y > DECISION_RADIUS || 
			obstacle.y < -DECISION_RADIUS) 
		{
			return;
		}
		
		if ((obstacle.x < DECISION_RADIUS && _this.v > 0) || 
			(obstacle.x > -DECISION_RADIUS && _this.v < 0))
		{
			return;
		}
		
		if (_this.v > 0) {
			var value = obstacle.x - DECISION_RADIUS;
		} else {
			var value = -obstacle.x - DECISION_RADIUS;
		}
		
		if (value < minValue) {
			minValue = value;
		}
	});
	
	return minValue/MAX_CLEARANCE_VALUE;
};


//
// ArcTrajectory
//

var ArcTrajectory = function (v, w, refPose) {
    var R = v/w;
		
	this.v = v;
	this.w = w;
	this.x = refPose.x - R * Math.sin(refPose.heading);
	this.y = refPose.y + R * Math.cos(refPose.heading);
	this.radius = Math.abs(R);
};

ArcTrajectory.prototype = new Trajectory();

ArcTrajectory.prototype.calcClearanceValue = function (obstacles) {
	var minValue = MAX_CLEARANCE_VALUE;
				
	if (this.w < 0) {
		var cpoint = new Point({x:0, y:-this.radius});
	} else {
		var cpoint = new Point({x:0, y:this.radius});
	}
	
	var _this = this;
	
	obstacles.forEach(function (obstacle, index, array) {
		var r = cpoint.euclid(obstacle);
		
		if (r + DECISION_RADIUS < _this.radius || r - DECISION_RADIUS > _this.radius) {
			return;
		}
		
		var angle = (2*Math.PI + Math.atan2(obstacle.y - cpoint.y, 
											obstacle.x - cpoint.x))%(Math.PI*2);
		if (_this.w > 0) {
			angle = (angle + Math.PI/2)%(Math.PI*2);
		} else {
			angle = (Math.PI*2 - angle + Math.PI/2)%(Math.PI*2);
		}

		var distance = angle * _this.radius;
		
		distance = (distance - _this.radius < 0) ? 0 : distance - _this.radius;
		
		if (distance < minValue) {
			minValue = distance;
		}
	});
	
	return minValue/MAX_CLEARANCE_VALUE;
};
