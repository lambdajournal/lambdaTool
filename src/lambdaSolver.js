/*jslint esnext:true */
/**
 * Created by Antonio, Andrea on 22/03/2015.
 */

const applyCallByName = (lambdaTerm) => {
    let steps = [];
    let stepClone = lambdaTerm;
    let makingProgress;
    do {
        steps.push(stepClone);
        stepClone = deepCopyLambdaTerm(stepClone);
        makingProgress = applyCallByNameStep(stepClone);
    } while (makingProgress);
    return steps;
};

// Applies outermost-leftmost resolution
const applyCallByNameStep = (lambdaTerm) => {
    switch (lambdaTerm.type) {
    case "var":
        return false;
    case "expr":
        return applyCallByNameStep(lambdaTerm.body);
    case "app":
        if (lambdaTerm.first.type === "expr") {
            var solvedLambdaTerm = applySafeBetaReduction(lambdaTerm);
            for (let lambdaTermProperty in lambdaTerm) {
                if (lambdaTerm.hasOwnProperty(lambdaTermProperty)) {
                    delete lambdaTerm[lambdaTermProperty];
                }
            }
            for (let solvedLambdaTermProperty in solvedLambdaTerm) {
                if (solvedLambdaTerm.hasOwnProperty(solvedLambdaTermProperty)) {
                    lambdaTerm[solvedLambdaTermProperty] = solvedLambdaTerm[solvedLambdaTermProperty];
                }
            }
            return true;
        }
        if (!applyCallByNameStep(lambdaTerm.first)) {
            return applyCallByNameStep(lambdaTerm.second);
        }
        return true;
    }
};

const applyAlphaEquivalence = (lambdaTerm, replacingRules) => {
    let result = deepCopyLambdaTerm(lambdaTerm);

    let visitFunctions = {
        visitVariable: (variable) => {
            let replacement = replacingRules[variable.name];
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

const captureAvoidingSubstitution = (lambdaTerm, replacingRules) => {
    let result = deepCopyLambdaTerm(lambdaTerm);

    if (lambdaTerm.type === "var") {
        // x[x:=s] => s
        let replacement = replacingRules[lambdaTerm.name];
        if (replacement) {
            return deepCopyLambdaTerm(replacement);
        }
        return lambdaTerm;
    }

    let visitFunctions = {
        visitVariable: (variable) => {},
        visitExpression: (expression) => {
            if (expression.body.type == "var") {
                // (\x1,x2,...,xn.x)[x:=s] => \x1,x2,...,xn.s
                let replacement = replacingRules[expression.body.name];
                if (replacement) {
                    expression.body = deepCopyLambdaTerm(replacement);
                }
            }
        },
        visitApplication: (application) => {
            if (application.first.type == "var") {
                // (x t)[x:=s] => (s t)
                let replacement = replacingRules[application.first.name];
                if (replacement) {
                    application.first = deepCopyLambdaTerm(replacement);
                }
            }
            if (application.second.type == "var") {
                // (t x)[x:=s] => (t s)
                let replacement = replacingRules[application.second.name];
                if (replacement) {
                    application.second = deepCopyLambdaTerm(replacement);
                }
            }
        }
    };

    visitLambdaTerm(result, visitFunctions);
    return result;
};

const applyBetaReduction = (lambdaApplication) => {
    if (lambdaApplication.type != "app")
        throw new Error("trying to apply a beta reduction to a term which is not an application");
    if (lambdaApplication.first.type != "expr")
        throw new Error("trying to apply a beta reduction to an application whose first is not an expression");
    let exprVars = lambdaApplication.first.vars;
    let exprBody = lambdaApplication.first.body;
    let replacingRules = {};
    replacingRules[exprVars[0].name] = lambdaApplication.second;

    if (exprVars.length == 1) {
        // (\x.t)s => t[x:=s]
        return captureAvoidingSubstitution(exprBody, replacingRules);
    } else {
        // currying
        // (\x1,x2...,xn.t s) => \x2,x3,...xn.(t[x1:=s])
        return {
            type: "expr",
            vars: deepCopyLambdaTerm(exprVars).slice(1),
            body: captureAvoidingSubstitution(exprBody, replacingRules)
        };
    }
};

const applySafeBetaReduction = (lambdaApplication) => {
    var {
        firstTerm,
        secondTerm
    } = disambiguateVariablesInLambdaTerms(lambdaApplication.first, lambdaApplication.second);

    return applyBetaReduction({
        type: "app",
        first: firstTerm,
        second: secondTerm
    });
};

const disambiguateVariablesInLambdaTerms = (firstTerm, secondTerm) => {
    const varsFirstTerm = findBoundAndFreeVariables(firstTerm);
    const varsSecondTerm = findBoundAndFreeVariables(secondTerm);

    const varsToBeRenamedInSecondTerm = varsFirstTerm
      .allVars
      .filter(el => varsSecondTerm.boundVars.indexOf(el) >= 0);
    const varsToBeRenamedInFirstTerm = varsFirstTerm
      .boundVars
      .filter(el => varsSecondTerm.freeVars.indexOf(el) >= 0);
    let allVars = varsFirstTerm
      .allVars
      .concat(varsSecondTerm.allVars);
    allVars = allVars
      .filter((el, pos) => allVars.indexOf(el) == pos);

    var generateFreshName = (vars, prefix) => {
        for (let i = 1; true; i++) {
            if (vars.indexOf(prefix + i) < 0)
                return prefix + i;
        }
    };

    let replacingRulesSecondTerm = {};
    for (let varToBeRenamedInSecondTerm of varsToBeRenamedInSecondTerm) {
        const newName = generateFreshName(allVars, varToBeRenamedInSecondTerm);
        replacingRulesSecondTerm[varToBeRenamedInSecondTerm] = newName;
    }

    let replacingRulesFirstTerm = {};
    for (let varToBeRenamedInFirstTerm of varsToBeRenamedInFirstTerm) {
        const newName = generateFreshName(allVars, varToBeRenamedInFirstTerm);
        replacingRulesFirstTerm[varToBeRenamedInFirstTerm] = newName;
    }

    return {
        firstTerm: applyAlphaEquivalence(firstTerm, replacingRulesFirstTerm),
        secondTerm: applyAlphaEquivalence(secondTerm, replacingRulesSecondTerm)
    };
};
