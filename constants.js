var SIMULATION_TIME_STEP = 10/1000, // seconds
    DECISION_TIME_STEP = 100/1000, // seconds
    DECISION_LOOKAHEAD = 10*DECISION_TIME_STEP,

    ROBOT_RADIUS = 5,
    
    V_MAX = 10,
    V_NUM_INCS = 5,
    DV_MAX = 10,
    V_INC = 2*DV_MAX*DECISION_TIME_STEP/V_NUM_INCS,
    
    W_MAX = Math.PI,
    W_NUM_INCS = 5,
    DW_MAX = Math.PI,
    W_INC = 2*DW_MAX*DECISION_TIME_STEP/W_NUM_INCS,
    
    MAX_CLEARANCE_VALUE = ROBOT_RADIUS*10;
    
    HEADING_WEIGHT = 1.0,
    SPEED_WEIGHT = 1.0,
    CLEARANCE_WEIGHT = 0.0;
