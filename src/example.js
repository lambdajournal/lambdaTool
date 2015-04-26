/* jslint esnext: true */
import {freshVariableNamesProvider} from "lambdaFreshVariableNamesProvider";
import {replaceWellKnownTerms, factorizeWellKnownTerms} from "lambdaWellKnownTerms";
import {applyCallByName} from "lambdaSolver";


export const render = () => {
    const input = lambdaParser.parse(document.getElementById("lambdaTerm").value);
    document.getElementById("outputRender").innerHTML = lambdaRender(input);
};

export const callByName = () => {
    let input = lambdaParser.parse(document.getElementById("lambdaTerm2").value);
    const freshVariableProvider = freshVariableNamesProvider(input);
    input = replaceWellKnownTerms(input, freshVariableProvider);
    const steps = applyCallByName(input).map(factorizeWellKnownTerms);
    let stepsHTML = "<ul>";
    for (let step of steps) {
        stepsHTML += "<li>" + lambdaRender(step) + "</li>";
    }
    stepsHTML += "</ul>";
    document.getElementById("outputCallByName").innerHTML = stepsHTML;
};
