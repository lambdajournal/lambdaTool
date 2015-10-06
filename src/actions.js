export const APPLY_CALL_BY_NAME = 'APPLY_CALL_BY_NAME';
export const APPLY_STEP_CALL_BY_NAME = 'APPLY_STEP_CALL_BY_NAME';


export const applyCallByName = (maxSteps) => ({type: APPLY_STEP_CALL_BY_NAME, maxSteps});
export const applyStepCallByName = () => ({type: APPLY_STEP_CALL_BY_NAME});
