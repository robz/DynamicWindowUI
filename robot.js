//
// Pose
//

var Pose = function (spec) {
    this.x = spec.x;
    this.y = spec.y;
    this.heading = spec.heading;
    this.v = spec.v;
    this.w = spec.w;
};
    
Pose.prototype.step = function (dt) {
	var new_x, new_y, new_heading;

	if (Math.abs(this.w) < 1.0e-6) {
		new_x = this.x + dt * this.v * Math.cos(this.heading);
		new_y = this.y + dt * this.v * Math.sin(this.heading);
		new_heading = this.heading;
	} else {
		var wd = dt * this.w,
			R = this.v / this.w;

		new_x = this.x + R * Math.sin(wd + this.heading) 
					   - R * Math.sin(this.heading);
		new_y = this.y - R * Math.cos(wd + this.heading) 
					   + R * Math.cos(this.heading);   
		new_heading = this.heading + wd;
		new_heading = (new_heading + Math.PI*2)%(Math.PI*2)
	}

	this.x = new_x;
	this.y = new_y;
	this.heading = new_heading;
};
    
Pose.prototype.copy = function () {
    return new Pose(this);
};


//
// Robot
//

var Robot = function (spec) {
    this.radius = spec.radius;
    this.color = spec.color;
    this.name = spec.name;
    this.pose = new Pose(spec);
};

Robot.prototype.step = function (dt) {
	this.pose.step(dt);
};
