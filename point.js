var Point = function (spec) {
	this.x = spec.x;
	this.y = spec.y;
};

Point.prototype.copy = function () {
	return new Point(this);
};

Point.prototype.transform = function (dx, dy, dtheta) {
	var p = this.copy();
	p.x = (this.x + dx) * Math.cos(dtheta) - (this.y + dy) * Math.sin(dtheta);
	p.y = (this.x + dx) * Math.sin(dtheta) + (this.y + dy) * Math.cos(dtheta);
	return p;
};

Point.prototype.euclid = function (p) {
	return Math.sqrt((p.x - this.x)*(p.x - this.x) + (p.y - this.y)*(p.y - this.y));
};
