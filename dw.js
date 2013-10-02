var DW = (function () {
	var that = {};

	that.createTrajectory = function (v, w, refPose) {
		if (Math.abs(v) < 1.0e-6) {
			return new PointTrajectory(v, w, refPose);
		} else if (Math.abs(w) < 1.0e-6) {
			return new LineTrajectory(v, w, refPose);
		} else {
			return new ArcTrajectory(v, w, refPose);
		}
	};

	that.calcTrajectories = function (pose, refPose) {
		var trajectories = [];

		for (vi = 0; vi < V_NUM_INCS; vi++) {
			var v = pose.v + (vi - Math.floor(V_NUM_INCS/2))*V_INC;
			
			if (v > V_MAX + 1e-6 || v < V_MIN - 1e-6) {
				continue;
			}
			
			for (wi = 0; wi < W_NUM_INCS; wi++) {
				var w = pose.w + (wi - Math.floor(W_NUM_INCS/2))*W_INC;
			
				if (w > W_MAX || w < W_MIN) {
					continue;
				}
				
				var trajectory = that.createTrajectory(v, w, refPose);

				if (wi === Math.floor(W_NUM_INCS/2) && vi === Math.floor(V_NUM_INCS/2)) {
					trajectory.isCurrent = true;
				}

				trajectories.push(trajectory);
			}
		}
				
		return trajectories;
	};

	that.calcDecision = function (
		pose, 
		goal, 
		trajectories, 
		obstacles, 
		dt) 
	{
		var decision = { v: null, w: null };

		var i, traj, value, maxValue = -1;

		// loop through trajectories
		for (i = 0; i < trajectories.length; i++) {
			traj = trajectories[i];

			// calculate trajectory value
			value = traj.calcHeadingValue(pose, goal, dt) * HEADING_WEIGHT +
					traj.calcSpeedValue() * SPEED_WEIGHT + 
					traj.calcClearanceValue(obstacles) * CLEARANCE_WEIGHT;

			if (value > maxValue) {
				maxValue = value;
				decision.v = traj.v;
				decision.w = traj.w;
			}
		}

		return decision;
	};
	
	return that;
})();
