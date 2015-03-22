start 
= term

term 
= openBracket innerTerm:term closeBracket { return innerTerm }
/ simpleTerm

simpleTerm
= variable
/ expression
/ application

variable
= chars:[A-Za-z0-9]+ { return chars.join(""); }

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