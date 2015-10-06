/* jslint esnext: true */
import {findBoundAndFreeVariables} from "./lambdaUtils";

export const freshVariableNamesProvider = function* (lambdaTerm) {
    const freshVariablePrefix = "x";
    const allVars = findBoundAndFreeVariables(lambdaTerm).allVars;
    for (let index = 1; true; index++) {
        const freshVariable = freshVariablePrefix + index;
        if (allVars.indexOf(freshVariable) < 0)
            yield freshVariable;
    }
};
