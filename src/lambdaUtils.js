/*jslint esnext:true */

export const visitLambdaTerm = (lambdaTerm, visitFunctions) => {
    switch (lambdaTerm.type) {
    case "var":
        // we are visiting a variable
        visitFunctions.visitVariable(lambdaTerm, visitFunctions);
        break;
    case "expr":
        // we are visiting an expression
        visitFunctions.visitExpression(lambdaTerm);

        for (let exprVar of lambdaTerm.vars) {
            visitFunctions.visitVariable(exprVar);
        }
        visitLambdaTerm(lambdaTerm.body, visitFunctions);
        break;
    case "app":
        // we are visiting an application
        visitFunctions.visitApplication(lambdaTerm);

        visitLambdaTerm(lambdaTerm.first, visitFunctions);
        visitLambdaTerm(lambdaTerm.second, visitFunctions);
        break;
    }
};

export const findBoundAndFreeVariables = (lambdaTerm) => {
    let allVars = [];
    let boundVars = [];
    let freeVars = [];

    const visitFunctions = {
        visitVariable: (variable) => {
            allVars.push(variable.name);
        },
        visitExpression: (expression) => {
            expression.vars.forEach(el => {
                boundVars.push(el.name);
            });
        },
        visitApplication: (application) => {}
    };
    visitLambdaTerm(lambdaTerm, visitFunctions);
    allVars = allVars.filter((el, pos) => allVars.indexOf(el) == pos);
    boundVars = boundVars.filter((el, pos) => boundVars.indexOf(el) == pos);

    freeVars = allVars.filter(el => boundVars.indexOf(el) < 0);
    return {
        freeVars: freeVars,
        boundVars: boundVars,
        allVars: allVars
    };
};

export const lambdaTermToString = (lambdaTerm) => {
    const visit = function (node) {
        let nodeContent;
        switch (node.type) {
        case "wellKnownTerm":
            nodeContent = node.name;
            break;
        case "var":
            nodeContent = node.name;
            break;
        case "expr":
            nodeContent = "\\";
            nodeContent += node.vars.map(visit).join(',');
            nodeContent += ".";
            nodeContent += visit(node.body);
            break;
        case "app":
            let firstContent = visit(node.first);
            firstContent = typeof (node.first) === "Object" ? ("(" + firstContent + ")") : firstContent;
            let secondContent = visit(node.second);
            secondContent = typeof (node.second) === "Object" ? ("(" + secondContent + ")") : secondContent;
            nodeContent = "(" + firstContent + " " + secondContent + ")";
            break;
        }
        return nodeContent;
    };
    return visit(lambdaTerm);
};

export const deepCopyLambdaTerm = (lambdaTerm) => JSON.parse(JSON.stringify(lambdaTerm));

export const coalescifyLambdaTerms = (lambdaTerm) => {
    let result = deepCopyLambdaTerm(lambdaTerm);
    coalescifyLambdaTermsR(result);
    return result;
}

const coalescifyLambdaTermsR = (lambdaTerm) => {
    switch (lambdaTerm.type) {
    case "expr":
        while (lambdaTerm.body.type == "expr") {
            lambdaTerm.body.vars.forEach((lambdaVar) => lambdaTerm.vars.push(lambdaVar));
            lambdaTerm.body = lambdaTerm.body.body;
        }
        coalescifyLambdaTermsR(lambdaTerm.body);
        break;
    case "app":
        coalescifyLambdaTermsR(lambdaTerm.first);
        coalescifyLambdaTermsR(lambdaTerm.second);
        break;
    }
}
