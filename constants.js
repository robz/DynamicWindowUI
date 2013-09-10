var DT = 100/1000,

    V_MAX = 10,
    V_NUM_INCS = 5,
    DV_MAX = V_MAX,
    V_INC = 2*DV_MAX*DT/V_NUM_INCS,
    
    W_MAX = Math.PI,
    W_NUM_INCS = 5,
    DW_MAX = W_MAX,
    W_INC = 2*DW_MAX*DT/W_NUM_INCS,
    
    HEADING_WEIGHT = 1.0,
    SPEED_WEIGHT = 1.0,
    CLEARANCE_WEIGHT = 1.0;
