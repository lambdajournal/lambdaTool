const replaceWellKnownTerms = (lambdaTerm, freshVariableNamesProvider) => {
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
        switch (wellKnownTerm.name) {
            case 'TRUE':
            {
                const firstVariableName = freshVariableNamesProvider.next().value;
                const secondVariableName = freshVariableNamesProvider.next().value;
                return {
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        },
                        {
                            "type": "var",
                            "name": secondVariableName
                        }
                    ],
                    "body": {
                        "type": "var",
                        "name": firstVariableName
                    }
                };
            }
            case 'FALSE':
            {
                const firstVariableName = freshVariableNamesProvider.next().value;
                const secondVariableName = freshVariableNamesProvider.next().value;
                return {
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        },
                        {
                            "type": "var",
                            "name": secondVariableName
                        }
                    ],
                    "body": {
                        "type": "var",
                        "name": secondVariableName
                    }
                };
            }
            case 'SUM':
            {
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                var forthVariableName = freshVariableNamesProvider.next().value;
                return {
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        },
                        {
                            "type": "var",
                            "name": secondVariableName
                        }
                    ],
                    "body": {
                        "type": "expr",
                        "vars": [
                            {
                                "type": "var",
                                "name": thirdVariableName
                            },
                            {
                                "type": "var",
                                "name": forthVariableName
                            }
                        ],
                        "body": {
                            "type": "app",
                            "first": {
                                "type": "app",
                                "first": {
                                    "type": "var",
                                    "name": firstVariableName
                                },
                                "second": {
                                    "type": "var",
                                    "name": thirdVariableName
                                }
                            },
                            "second": {
                                "type": "app",
                                "first": {
                                    "type": "app",
                                    "first": {
                                        "type": "var",
                                        "name": secondVariableName
                                    },
                                    "second": {
                                        "type": "var",
                                        "name": thirdVariableName
                                    }
                                },
                                "second": {
                                    "type": "var",
                                    "name": forthVariableName
                                }
                            }
                        }
                    }
                };
            }
            case 'SUCC':
            {
                var firstVariableName = freshVariableNamesProvider.next().value;
                var thirdVariableName = freshVariableNamesProvider.next().value;
                var forthVariableName = freshVariableNamesProvider.next().value;
                return {
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        }
                    ],
                    "body": {
                        "type": "expr",
                        "vars": [
                            {
                                "type": "var",
                                "name": thirdVariableName
                            },
                            {
                                "type": "var",
                                "name": forthVariableName
                            }
                        ],
                        "body": {
                            "type": "app",
                            "first": {
                                "type": "var",
                                "name": thirdVariableName
                            },
                            "second": {
                                "type": "app",
                                "first": {
                                    "type": "app",
                                    "first": {
                                        "type": "var",
                                        "name": firstVariableName
                                    },
                                    "second": {
                                        "type": "var",
                                        "name": thirdVariableName
                                    }
                                },
                                "second": {
                                    "type": "var",
                                    "name": forthVariableName
                                }
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
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        },
                        {
                            "type": "var",
                            "name": secondVariableName
                        }
                    ],
                    "body": {
                        "type": "expr",
                        "vars": [
                            {
                                "type": "var",
                                "name": thirdVariableName
                            },
                            {
                                "type": "var",
                                "name": forthVariableName
                            }
                        ],
                        "body": {
                            "type": "app",
                            "first": {
                                "type": "app",
                                "first": {
                                    "type": "var",
                                    "name": firstVariableName
                                },
                                "second": {
                                    "type": "app",
                                    "first": {
                                        "type": "app",
                                        "first": {
                                            "type": "var",
                                            "name": secondVariableName
                                        },
                                        "second": {
                                            "type": "var",
                                            "name": thirdVariableName
                                        }
                                    },
                                    "second": {
                                        "type": "var",
                                        "name": forthVariableName
                                    }
                                }
                            },
                            "second": {
                                "type": "var",
                                "name": forthVariableName
                            }
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
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        },
                        {
                            "type": "var",
                            "name": secondVariableName
                        }
                    ],
                    "body": {
                        "type": "app",
                        "first": {
                            "type": "app",
                            "first": {
                                "type": "var",
                                "name": firstVariableName
                            },
                            "second": {
                                "type": "var",
                                "name": firstVariableName
                            }
                        },
                        "second": {
                            "type": "var",
                            "name": secondVariableName
                        }
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
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        }
                    ],
                    "body": {
                        "type": "expr",
                        "vars": [
                            {
                                "type": "var",
                                "name": thirdVariableName
                            },
                            {
                                "type": "var",
                                "name": forthVariableName
                            }
                        ],
                        "body": {
                            "type": "app",
                            "first": {
                                "type": "app",
                                "first": {
                                    "type": "var",
                                    "name": firstVariableName
                                },
                                "second": {
                                    "type": "var",
                                    "name": forthVariableName
                                }
                            },
                            "second": {
                                "type": "var",
                                "name": thirdVariableName
                            }
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
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        },
                        {
                            "type": "var",
                            "name": secondVariableName
                        },
                        {
                            "type": "var",
                            "name": thirdVariableName
                        }
                    ],
                    "body": {
                        "type": "app",
                        "first": {
                            "type": "app",
                            "first": {
                                "type": "var",
                                "name": firstVariableName
                            },
                            "second": {
                                "type": "var",
                                "name": secondVariableName
                            }
                        },
                        "second": {
                            "type": "var",
                            "name": thirdVariableName
                        }
                    }
                };
            }
            case 'ISZERO':
            {
                // \x1.((x1 \x2.F) T)
                var firstVariableName = freshVariableNamesProvider.next().value;
                var secondVariableName = freshVariableNamesProvider.next().value;
                return {
                    "type": "expr",
                    "vars": [
                        {
                            "type": "var",
                            "name": firstVariableName
                        }
                    ],
                    "body": {
                        "type": "app",
                        "first": {
                            "type": "app",
                            "first": {
                                "type": "var",
                                "name": firstVariableName
                            },
                            "second": {
                                "type": "expr",
                                "vars": [
                                    {
                                        "type": "var",
                                        "name": secondVariableName
                                    }
                                ],
                                "body": {
                                    "type": "wellKnownTerm",
                                    "name": "FALSE",
                                    "subtype": "string"
                                }
                            }
                        },
                        "second": {
                            "type": "wellKnownTerm",
                            "name": "TRUE",
                            "subtype": "string"
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
                    "type": "var",
                    "name": firstVariableName
                },
                {
                    "type": "var",
                    "name": secondVariableName
                }
            ],
            body: resultBody
        };
    } else {
        throw new Error('This type of wellKnownTerm is not supported');
    }

};

const factorizeWellKnownTerms = (step) => {
  let lambdaTermStr = lambdaTermToString(coalescifyLambdaTerms(step));
  const wellKnownTermMapping = {
    "TRUE": /\\([a-z][a-z0-9]+),([a-z][a-z0-9]+)\.(\1)/g,
    "FALSE": /\\([a-z][a-z0-9]+),([a-z][a-z0-9]+)\.(\2)/g,
    "SUM": /\\([a-z][a-z0-9]+),([a-z][a-z0-9]+),([a-z][a-z0-9]+),([a-z][a-z0-9]+)\.\(\(\1 \3\) \(\(\2 \3\) \4\)\)/g,
    "SUCC": /\\([a-z][a-z0-9]+),([a-z][a-z0-9]+),([a-z][a-z0-9]+)\.\(\2 \(\(\1 \2\) \3\)\)/g,
    "NOT": /\\([a-z][a-z0-9]+)\.\\([a-z][a-z0-9]+),([a-z][a-z0-9]+)\.\(\((\1 \3)\) (\2)\)/g,
    "IF": /\\([a-z][a-z0-9]+),([a-z][a-z0-9]+),([a-z][a-z0-9]+)\.\(\((\1) (\2)\) (\3)\)/g
  };
  for(let key in wellKnownTermMapping) {
    lambdaTermStr = lambdaTermStr.replace(wellKnownTermMapping[key], key);
  }
  return lambdaParser.parse(lambdaTermStr);
};
