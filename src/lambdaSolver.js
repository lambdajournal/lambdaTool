/*jslint esnext:true */
/**
 * Created by Antonio on 22/03/2015.
 */

var lambdaSolve = function (lambdaTerm) {

};

var applyCallByNameStep = function (lambaTerm) {
    nextCallByNameStep();
}


// Outer Most, Left Most
var applyCallByNameStep = function (lambdaTerm) {
    switch (lambdaTerm.type) {
    case "var":
        break;
    case "expr":
        applyCallByNameStep(lambdaTerm.body);
        break;
    case "app":
        if (lambdaTerm.first.type === "expr") {
            var solvedLambdaTerm = applySafeBetaReduction(lambdaTerm);
            for (var lambdaTermProperty in lambdaTerm) {
                if (lambdaTerm.hasOwnProperty(lambdaTermProperty)) {
                    delete lambdaTerm[lambdaTermProperty];
                }
            }
            for (var solvedLambdaTermProperty in solvedLambdaTerm) {
                if(solvedLambdaTerm.hasOwnProperty(solvedLambdaTermProperty)) {
                    lambdaTerm[solvedLambdaTermProperty] = solvedLambdaTerm[solvedLambdaTermProperty];
                }            
            }
            break;
        }
        applyCallByNameStep(lambdaTerm.first);
        break;
    }
};

var visitLambdaTerm = function (lambdaTerm, visitFunctions) {
    switch (lambdaTerm.type) {
    case "var":
        // we are visiting a variable
        visitFunctions.visitVariable(lambdaTerm, visitFunctions);
        break;
    case "expr":
        // we are visiting an expression
        visitFunctions.visitExpression(lambdaTerm);

        for (var exprVar of lambdaTerm.vars) {
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

var deepCopyLambdaTerm = (lambdaTerm) => JSON.parse(JSON.stringify(lambdaTerm));

var lambdaTermToString = function (lambaTerm) {
    var visit = function (node) {
        var nodeContent;
        switch (node.type) {
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
            var firstContent = visit(node.first);
            firstContent = typeof (node.first) === "Object" ? ("(" + firstContent + ")") : firstContent;
            var secondContent = visit(node.second);
            secondContent = typeof (node.second) === "Object" ? ("(" + secondContent + ")") : secondContent;
            nodeContent = "(" + firstContent + " " + secondContent + ")";
            break;
        }
        return nodeContent;
    };
    return visit(lambaTerm);
};

var applyAlphaEquivalence = function (lambdaTerm, replacingRules) {
    var result = deepCopyLambdaTerm(lambdaTerm);

    var visitFunctions = {
        visitVariable: (variable) => {
            var replacement = replacingRules[variable.name];
            if (replacement) {
                variable.name = replacement;
            }
        },
        visitExpression: (expression) => {},
        visitApplication: (application) => {}
    };

    visitLambdaTerm(result, visitFunctions);
    return result;
};

var captureAvoidingSubstitution = function (lambdaTerm, replacingRules) {
    var result = deepCopyLambdaTerm(lambdaTerm);

    if (lambdaTerm.type === "var") {
        // x[x:=s] => s
        var replacement = replacingRules[lambdaTerm.name];
        if (replacement) {
            return deepCopyLambdaTerm(replacement);
        }
        return lambdaTerm;
    }

    var visitFunctions = {
        visitVariable: (variable) => {},
        visitExpression: (expression) => {
            if (expression.body.type == "var") {
                // (\x1,x2,...,xn.x)[x:=s] => \x1,x2,...,xn.s
                var replacement = replacingRules[expression.body.name];
                if (replacement) {
                    expression.body = deepCopyLambdaTerm(replacement);
                }
            }
        },
        visitApplication: (application) => {
            if (application.first.type == "var") {
                // (x t)[x:=s] => (s t)
                var replacement = replacingRules[application.first.name];
                if (replacement) {
                    application.first = deepCopyLambdaTerm(replacement);
                }
            }
            if (application.second.type == "var") {
                // (t x)[x:=s] => (t s)
                var replacement = replacingRules[application.second.name];
                if (replacement) {
                    application.second = deepCopyLambdaTerm(replacement);
                }
            }
        }
    };

    visitLambdaTerm(result, visitFunctions);
    return result;
};

var applyBetaReduction = function (lambdaApplication) {
    if (lambdaApplication.type != "app")
        throw new Error("trying to apply a beta reduction to a term which is not an application");
    if (lambdaApplication.first.type != "expr")
        throw new Error("trying to apply a beta reduction to an application whose first is not an expression");
    var exprVars = lambdaApplication.first.vars;
    var exprBody = lambdaApplication.first.body;
    if (exprVars.length == 1) {
        // (\x.t)s => t[x:=s]
        var replacingRules = {};
        replacingRules[exprVars[0].name] = lambdaApplication.second;
        return captureAvoidingSubstitution(exprBody, replacingRules);
    } else {
        // currying
        // (\x1,x2...,xn.t s) => \x2,x3,...xn.(t[x1:=s])
        var replacingRules = {};
        replacingRules[exprVars[0].name] = lambdaApplication.second;
        var captureAvoidingSubResult = captureAvoidingSubstitution(exprBody, replacingRules);
        var exprVarsResult = deepCopyLambdaTerm(exprVars).slice(1);
        var exprResult = {
            type: "expr",
            vars: exprVarsResult,
            body: captureAvoidingSubResult
        };
        return exprResult;
    }
};

var applySafeBetaReduction = function (lambdaApplication) {
    var {
        firstTerm, secondTerm
    } =
    disambiguateVariablesInLambdaTerms(lambdaApplication.first, lambdaApplication.second);
    return applyBetaReduction({
        type: "app",
        first: firstTerm,
        second: secondTerm
    })
};

var disambiguateVariablesInLambdaTerms = function (firstTerm, secondTerm) {
    var varsFirstTerm = findBoundAndFreeVariables(firstTerm);
    var varsSecondTerm = findBoundAndFreeVariables(secondTerm);

    var varsToBeRenamedInSecondTerm = varsFirstTerm.allVars.filter(el => varsSecondTerm.boundVars.indexOf(el) >= 0);
    var varsToBeRenamedInFirstTerm = varsFirstTerm.boundVars.filter(el => varsSecondTerm.freeVars.indexOf(el) >= 0);
    var allVars = varsFirstTerm.allVars.concat(varsSecondTerm.allVars);
    allVars = allVars.filter((el, pos) => allVars.indexOf(el) == pos);

    var generateFreshName = (vars, prefix) => {
        for (var i = 1; true; i++) {
            if (vars.indexOf(prefix + i) < 0)
                return prefix + i;
        }
    };

    var replacingRulesSecondTerm = {};
    for (var varToBeRenamedInSecondTerm of varsToBeRenamedInSecondTerm) {
        var newName = generateFreshName(allVars, varToBeRenamedInSecondTerm);
        replacingRulesSecondTerm[varToBeRenamedInSecondTerm] = newName;
    }

    var replacingRulesFirstTerm = {};
    for (var varToBeRenamedInFirstTerm of varsToBeRenamedInFirstTerm) {
        var newName = generateFreshName(allVars, varToBeRenamedInFirstTerm);
        replacingRulesFirstTerm[varToBeRenamedInFirstTerm] = newName;
    }

    return {
        firstTerm: applyAlphaEquivalence(firstTerm, replacingRulesFirstTerm),
        secondTerm: applyAlphaEquivalence(secondTerm, replacingRulesSecondTerm)
    };
};

var findBoundAndFreeVariables = function (lambdaTerm) {
    var allVars = [];
    var boundVars = [];
    var freeVars = [];

    var visitFunctions = {
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