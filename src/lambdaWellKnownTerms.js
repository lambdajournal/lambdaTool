/*jslint esnext:true */
import {lambdaTermToString, coalescifyLambdaTerms} from "lambdaUtils";

export const replaceWellKnownTerms = (lambdaTerm, freshVariableNamesProvider) => {
    switch (lambdaTerm.type) {
    case "wellKnownTerm":
        return resolveWellKnownTerms(lambdaTerm, freshVariableNamesProvider);
    case "var":
        return lambdaTerm;
    case "expr":
        if (lambdaTerm.body.type === 'wellKnownTerm') {
            lambdaTerm.body = resolveWellKnownTerms(lambdaTerm.body, freshVariableNamesProvider);
        } else {
            // if lambda.body !== wellKnowTerm
            replaceWellKnownTerms(lambdaTerm.body, freshVariableNamesProvider);
        }
        return lambdaTerm;
    case "app":
        if (lambdaTerm.first.type === 'wellKnownTerm') {
            lambdaTerm.first = resolveWellKnownTerms(lambdaTerm.first, freshVariableNamesProvider);
        } else {
            replaceWellKnownTerms(lambdaTerm.first, freshVariableNamesProvider);
        }
        if (lambdaTerm.second.type === 'wellKnownTerm') {
            lambdaTerm.second = resolveWellKnownTerms(lambdaTerm.second, freshVariableNamesProvider);
        } else {
            replaceWellKnownTerms(lambdaTerm.second, freshVariableNamesProvider);
        }
        return lambdaTerm;
    }
};

const resolveWellKnownTerms = (wellKnownTerm, freshVariableNamesProvider) => {
    if (wellKnownTerm.subType === 'string') {
        switch (wellKnownTerm.name.toUpperCase()) {
            case 'I':
            {
                const firstVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [ { type: "var", name: firstVariableName } ],
                    body: { type: "var", name: firstVariableName }
                };
            }
            case 'TRUE':
            case 'T':
            case 'K':
            {
                const firstVariableName = freshVariableNamesProvider.next().value;
                const secondVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName },
                        { type: "var", name: secondVariableName }
                    ],
                    body: { type: "var", name: firstVariableName }
                };
            }
            case 'FALSE':
            case 'F':
            case 'ZERO':
            {
                const firstVariableName = freshVariableNamesProvider.next().value;
                const secondVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName },
                        { type: "var", name: secondVariableName }
                    ],
                    body: { type: "var", name: secondVariableName }
                };
            }
            case 'SUM':
            {
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                var forthVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName },
                        { type: "var", name: secondVariableName }
                    ],
                    body: {
                        type: "expr",
                        vars: [
                            { type: "var", name: thirdVariableName },
                            { type: "var", name: forthVariableName }
                        ],
                        body: {
                            type: "app",
                            first: {
                                type: "app",
                                first: { type: "var", name: firstVariableName },
                                second: { type: "var", name: thirdVariableName }
                            },
                            second: {
                                type: "app",
                                first: {
                                    type: "app",
                                    first: { type: "var", name: secondVariableName },
                                    second: { type: "var", name: thirdVariableName }
                                },
                                second: { type: "var", name: forthVariableName }
                            }
                        }
                    }
                };
            }
            case 'SUCC':
            case 'INC':
            {
                var firstVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                var forthVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName }
                    ],
                    body: {
                        type: "expr",
                        vars: [
                            { type: "var", name: thirdVariableName },
                            { type: "var", name: forthVariableName }
                        ],
                        body: {
                            type: "app",
                            first: { type: "var", name: thirdVariableName },
                            second: {
                                type: "app",
                                first: {
                                    type: "app",
                                    first: { type: "var", name: firstVariableName },
                                    second: { type: "var", name: thirdVariableName }
                                },
                                second: { type: "var", name: forthVariableName }
                            }
                        }
                    }
                };
            }
            case 'AND':
            {
                // \x1,x2.\x3,x4.((x1 (x2 (x3 x4))) x4)
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                var forthVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName },
                        { type: "var", name: secondVariableName }
                    ],
                    body: {
                        type: "expr",
                        vars: [
                            { type: "var", name: thirdVariableName },
                            { type: "var", name: forthVariableName }
                        ],
                        body: {
                            type: "app",
                            first: {
                                type: "app",
                                first: { type: "var", name: firstVariableName },
                                second: {
                                    type: "app",
                                    first: {
                                        type: "app",
                                        first: { type: "var", name: secondVariableName },
                                        second: { type: "var", name: thirdVariableName }
                                    },
                                    second: { type: "var", name: forthVariableName }
                                }
                            },
                            second: { type: "var", name: forthVariableName }
                        }
                    }
                };
            }
            case 'OR':
            {
                // \x,y.((x x) y)
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName },
                        { type: "var", name: secondVariableName }
                    ],
                    body: {
                        type: "app",
                        first: {
                            type: "app",
                            first: { type: "var", name: firstVariableName },
                            second: { type: "var", name: firstVariableName }
                        },
                        second: { type: "var", name: secondVariableName }
                    }
                };
            }
            case 'NOT':
            {
                // \x1.\x3,x4.((x1 x4) x3)
                var firstVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                var forthVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName }
                    ],
                    body: {
                        type: "expr",
                        vars: [
                            { type: "var", name: thirdVariableName },
                            { type: "var", name: forthVariableName }
                        ],
                        body: {
                            type: "app",
                            first: {
                                type: "app",
                                first: { type: "var", name: firstVariableName },
                                second: { type: "var", name: forthVariableName }
                            },
                            second: { type: "var", name: thirdVariableName }
                        }
                    }
                };
            }
            case 'IF':
            {
                // \x1,x2,x3.((x1 x2) x3)
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName },
                        { type: "var", name: secondVariableName },
                        { type: "var", name: thirdVariableName }
                    ],
                    body: {
                        type: "app",
                        first: {
                            type: "app",
                            first: { type: "var", name: firstVariableName },
                            second: { type: "var", name: secondVariableName }
                        },
                        second: { type: "var", name: thirdVariableName }
                    }
                };
            }
            case 'ISZERO':
            {
                // \x1.((x1 \x2.F) T)
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                return replaceWellKnownTerms({
                    type: "expr",
                    vars: [
                        { type: "var", name: firstVariableName }
                    ],
                    body: {
                        type: "app",
                        first: {
                            type: "app",
                            first: { type: "var", name: firstVariableName },
                            second: {
                                type: "expr",
                                vars: [
                                    { type: "var", name: secondVariableName }
                                ],
                                body: {
                                    type: "wellKnownTerm",
                                    name: "FALSE",
                                    "subType": "string"
                                }
                            }
                        },
                        second: {
                            type: "wellKnownTerm",
                            name: "TRUE",
                            "subType": "string"
                        }
                    }
                }, freshVariableNamesProvider);
            }
            case 'Y':
            {
                // \x1.(\x2.(x1 (x2 x2)) \x3.(x1 (x3 x3)))
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [ { type: "var", name: firstVariableName } ],
                    body: {
                        type: "app",
                        first: {
                            type: "expr",
                            vars: [ { type: "var", name: secondVariableName } ],
                            body: {
                                type: "app",
                                first: { type: "var", name: firstVariableName },
                                second: {
                                    type: "app",
                                    first: { type: "var", name: secondVariableName },
                                    second: { type: "var", name: secondVariableName }
                                }
                            }
                        },
                        second: {
                            type: "expr",
                            vars: [ { type: "var", name: thirdVariableName } ],
                            body: {
                                type: "app",
                                first: { type: "var", name: firstVariableName },
                                second: {
                                    type: "app",
                                    first: { type: "var", name: thirdVariableName },
                                    second: { type: "var", name: thirdVariableName }
                                }
                            }
                        }
                    }
                };
            }
            case 'MUL':
            case 'MULT':
            case 'PROD':
            {
                // \x1,x2,x3.(x1 (x2 x3))
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                      { type: "var", name: firstVariableName },
                      { type: "var", name: secondVariableName },
                      { type: "var", name: thirdVariableName } ],
                    body: {
                        type: "app",
                        first:  { type: "var", name: firstVariableName },
                        second: {
                            type: "app",
                            first: { type: "var", name: secondVariableName },
                            second: { type: "var", name: thirdVariableName }
                        }
                    }
                };
            }
            case 'PRED':
            {
                // \x1,x2,x3.(((x1 \x4,x5.(x5 (x4 x2))) \x6.x3) \x7.x7)
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                var forthVariableName = freshVariableNamesProvider.next().value;
                var fifthVariableName = freshVariableNamesProvider.next().value;
                var sixthVariableName = freshVariableNamesProvider.next().value;
                var seventhVariableName = freshVariableNamesProvider.next().value;
                return {
                    type: "expr",
                    vars: [
                      { type: "var", name: firstVariableName },
                      { type: "var", name: secondVariableName },
                      { type: "var", name: thirdVariableName } ],
                    body: {
                        type: "app",
                        first:  {
                            type: "app",
                            first: {
                                type: "app",
                                first: { type: "var", name: firstVariableName },
                                second: {
                                    type: "expr",
                                    vars: [
                                        { type: "var", name: forthVariableName },
                                        { type: "var", name: fifthVariableName },
                                    ],
                                    body: {
                                        type: "app",
                                        first: { type: "var", name: fifthVariableName },
                                        second: {
                                            type: "app",
                                            first: { type: "var", name: forthVariableName },
                                            second: { type: "var", name: secondVariableName }
                                        }
                                    }
                                }
                            },
                            second: {
                                type: "expr",
                                vars: [ { type: "var", name: sixthVariableName } ],
                                body: { type: "var", name: thirdVariableName }
                            }
                        },
                        second: {
                            type: "expr",
                            vars: [ { type: "var", name: seventhVariableName } ],
                            body: { type: "var", name: seventhVariableName }
                        }
                    }
                };
            }
        }

    } else if (wellKnownTerm.subType === 'number') {
        const number = Number(wellKnownTerm.name);
        const firstVariableName = freshVariableNamesProvider.next().value;
        const secondVariableName = freshVariableNamesProvider.next().value;
        let resultBody = {
            type: 'var',
            name: secondVariableName
        };
        for (let n = 0; n < number; n++) {
            resultBody = {
                type: 'app',
                first: {
                    type: 'var',
                    name: firstVariableName
                },
                second: resultBody
            };
        }
        return {
            type: 'expr',
            vars: [
                {
                    type: "var",
                    name: firstVariableName
                },
                {
                    type: "var",
                    name: secondVariableName
                }
            ],
            body: resultBody
        };
    } else {
        throw new Error('This type of wellKnownTerm is not supported: ' + wellKnownTerm.subType);
    }

};

export const factorizeWellKnownTerms = (lambdaTerm) => {
  let lambdaTermStr = lambdaTermToString(coalescifyLambdaTerms(lambdaTerm));
  // These mappings are exhaustive only after coalescing
  const mappings = [
    // I: \x1.x1
    { name: "I", expr: /\\([a-z][a-z0-9]*)\.\1/g},
    // TRUE: \x1,x2.x1
    { name: "TRUE", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\1/g },
    // FALSE: \x1,x2.x2
    { name: "FALSE", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\2/g },
    // SUM: \x1,x2,x3,x4.((x1 x3) ((x2 x3) x4))
    { name: "SUM", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\(\1 \3\) \(\(\2 \3\) \4\)\)/g },
    // SUCC: \x1,x2,x3.(x2 ((x1 x2) x3))
    { name: "SUCC", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\2 \(\(\1 \2\) \3\)\)/g },
    // First AND version: \x1,x2.((x1 x2) x1)
    { name: "AND", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\(\1 \2\) \1\)/g },
    // Second AND version: \x1,x2.((x1 x2) FALSE), where FALSE has already been factorized
    { name: "AND", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\(\1 \2\) FALSE\)/g },
    // Third AND version: \x1,x2,x3,x4.((x1 (x2 (x3 x4))) x4)
    { name: "AND", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\(\1 \(\2 \(\3 \4\)\)\) \4\)/g },
    // First OR version: \x1,x2.((x1 x1) x2)
    { name: "OR", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\(\1 \1\) \2\)/g },
    // Second OR version: \x1,x2.((x1 TRUE) x2), where TRUE has already been factorized
    { name: "OR", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\(\1 TRUE\) \2\)/g },
    // Third OR version: \x1,x2,x3,x4.((x1 x3) ((x2 x3) x4)
    { name: "OR", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\(\1 \3\) \(\(\2 \3\) \4\)/g },
    // NOT: \x1,x2,x3.((x1 x3) x2)
    { name: "NOT", expr: /\\([a-z][a-z0-9]*)\.\\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\((\1 \3)\) (\2)\)/g },
    // IF: \x1,x2,x3.((x1 x2) x3)
    { name: "IF", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\((\1) (\2)\) (\3)\)/g },
    // ISZERO: \x1.((x1 \x2.F) T) => \x1.((x1 \x2,x3,x4.x4) T)
    { name: "ISZERO", expr: /\\([a-z][a-z0-9]*)\.\(\(\1 \\([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\4\) TRUE\)/g},
    // Y: \x1.(\x2.(x1 (x2 x2)) \x3.(x1 (x3 x3)))
    { name: "Y", expr: /\\([a-z][a-z0-9]*)\.\(\\([a-z][a-z0-9]*)\.\(\1 \(\2 \2\)\) \\([a-z][a-z0-9]*)\.\(\1 \(\3 \3\)\)\)/g},
    // MUL: \x1,x2,x3.(x1 (x2 x3))
    { name: "MUL", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\1 \(\2 \3\)\)/g},
    // PRED: \x1,x2,x3.(((x1 \x4,x5.(x5 (x4 x2))) \x6.x3) I) where I has already been factorized
    { name: "PRED", expr: /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\(\(\1 \\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.\(\5 \(\4 \2\)\)\) \\([a-z][a-z0-9]*)\.\3\) I\)/g}
  ];
  for(let mapping of mappings) {
    lambdaTermStr = lambdaTermStr.replace(mapping.expr, mapping.name);
  }
  // Factorize numbers: \x1,x2.(x1 (x1 (... (x1 x2)...))
  const numberRegex = /\\([a-z][a-z0-9]*),([a-z][a-z0-9]*)\.((?:\(\1\s)*)\2(\)*)/g;
  lambdaTermStr = lambdaTermStr.replace(numberRegex, (fullMatch, var1, var2, var1chain, closeBracketChain) => {
    const numberOfOpenBracket = var1chain.split("(").length - 1;
    if (numberOfOpenBracket <= closeBracketChain.length)
      return numberOfOpenBracket + ")".repeat(closeBracketChain.length - numberOfOpenBracket);
    return fullMatch;
  });
  return lambdaParser.parse(lambdaTermStr);
};
