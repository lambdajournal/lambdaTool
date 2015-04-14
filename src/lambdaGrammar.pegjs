start 
= term

term 
= openBracket innerTerm:term closeBracket { return innerTerm }
/ simpleTerm

simpleTerm
= wellKnownTerm
/ variable
/ expression
/ application

wellKnownTerm
= chars: ("TRUE" / "FALSE" / "SUM" / [0-9]+) { return { type: "wellKnownTerm", name: chars.toString().replace(/,/g,""), subType: typeof(chars) === 'string' ? 'string' : 'number'}}

variable
= first:[a-z] others:[a-z0-9]* { return { type: "var", name: first + others.join("")}; }

expression
= "\\" vars:varList "." body:term { return { type: "expr", vars: vars, body: body}; }

application
= openBracket first:term " " second:term closeBracket { return { type: "app", first:first, second:second }}

openBracket
= [\(\[\{]

closeBracket
= [\)\]\}]

varList
= first:variable following:("," variable)* { return [first].concat(following.map(function(el) { return el[1];}));  }