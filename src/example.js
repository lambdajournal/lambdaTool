const render = () => {
    const input = lambdaParser.parse(document.getElementById("lambdaTerm").value);
    document.getElementById("outputRender").innerHTML = lambdaRender(input);
};

const callByName = () => {
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
