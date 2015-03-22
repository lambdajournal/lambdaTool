/**
 * Created by Antonio on 22/03/2015.
 */

var lambdaSolve = function(lambdaTerm) {

};

var visitLambdaTerm = function(lambdaTerm, visitFunctions) {
    switch (lambdaTerm.type) {
        case "var" :
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
            case "var" :
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
                firstContent = typeof(node.first) === "Object" ? ("(" + firstContent + ")") : firstContent;
                var secondContent = visit(node.second);
                secondContent = typeof(node.second) === "Object" ? ("(" + secondContent + ")") : secondContent;
                nodeContent = "(" + firstContent + " " + secondContent + ")";
                break;
        }
        return nodeContent;
    };
    return visit(lambaTerm);
};

    var applyAlphaEquivalence = function(lambdaTerm, replacingRules){
        var result = deepCopyLambdaTerm(lambdaTerm);

        var visitFunctions = {
            visitVariable : (variable) => {
                var replacement = replacingRules[variable.name];
                if (replacement) {
                    variable.name = replacement;
                }
            },
            visitExpression : (expression) => {},
            visitApplication : (application) => {}
        };

        visitLambdaTerm(result, visitFunctions);
        return result;
    };

    var captureAvoidingSubstitution = function(lambdaTerm, replacingRules) {
        var result = deepCopyLambdaTerm(lambdaTerm);

        var visitFunctions = {
            visitVariable : (variable) => {},
            visitExpression : (expression) => {
                if (expression.body.type == "var") {
                    // (\x1,x2,...,xn.x)[x:=s] => \x1,x2,...,xn.s
                    var replacement = replacingRules[expression.body.name];
                    if (replacement) {
                        expression.body = deepCopyLambdaTerm(replacement);
                    }
                }
            },
            visitApplication : (application) => {
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

    var applyBetaReduction = function(lambdaApplication) {
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
            var replacingRules =  {};
            replacingRules[exprVars[0].name] = lambdaApplication.second;
            var captureAvoidingSubResult = captureAvoidingSubstitution(exprBody,replacingRules);
            var exprVarsResult = deepCopyLambdaTerm(exprVars).slice(1);
            var exprResult = {
                type: "expr",
                vars: exprVarsResult,
                body: captureAvoidingSubResult
            };
            return exprResult;
        }
    };