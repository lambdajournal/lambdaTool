/* jslint esnext: true */
var colorProvider = function*() {
  while (true) {
    yield "black";
    yield "gray";
    yield "navy";
    yield "blue";
    yield "maroon";
    yield "purple";
    yield "fuchsia";
    yield "red";
    yield "orange";
  }
};

var fontSizeProvider = function*(initialSize, deltaSize) {
  var currentSize = initialSize;
  while (true) {
    yield currentSize;
    if (currentSize - deltaSize >= 8) {
      currentSize -= deltaSize;
    }
  }
};

var bracketsProvider = function*() {
  while (true) {
    yield { open: "{", close: "}"};
    yield { open: "[", close: "]"};
    yield { open: "(", close: ")"};    
  }
};

var formatterProvider = function*(initialSize, deltaSize) {
  var colorProviderInstance = colorProvider();
  var fontSizeProviderInstance = fontSizeProvider(initialSize, deltaSize);
  var bracketsProviderInstance = bracketsProvider();
  var level = yield {};
  var formats = [];
  while (true) {
    if (level < formats.length) {
      yield formats[level];
      level = yield {};
      continue;
    }
      
    formats.push({ 
      color: colorProviderInstance.next().value,
      fontSize: fontSizeProviderInstance.next().value,
      brackets: bracketsProviderInstance.next().value
    });
  }
};

lambdaRender = function (lambdaTerm, initialSize, deltaSize) {
  initialSize = initialSize || 50;
  deltaSize = deltaSize || 5;
  var formatterProviderInstance = formatterProvider(initialSize, deltaSize);
  return visit(lambdaTerm, formatterProviderInstance, 0);
};

var visit = function (node, formatterProviderInstance, level) {
  formatterProviderInstance.next(level).value;
  var currentFormat = formatterProviderInstance.next(level).value;
  var nodeContent;
  
  switch(node.type) {
      case "wellKnownTerm":
          nodeContent = node.name;
          break;
      case "var" :
          nodeContent = node.name;
          break;
      case "expr":
          nodeContent = "&lambda;";
          nodeContent += node.vars.map(function (v) {
            return visit(v, formatterProviderInstance, level);
          }).join(',');
          nodeContent += ".";
          nodeContent += visit(node.body, formatterProviderInstance, level);
          break;
      case "app":
          var firstContent = visit(node.first, formatterProviderInstance, level + 1);
          firstContent = typeof(node.first) === "Object" ? ("(" + firstContent + ")") : firstContent;
          var secondContent = visit(node.second, formatterProviderInstance, level + 1);
          secondContent = typeof(node.second) === "Object" ? ("(" + secondContent + ")") : secondContent;
          var subContent = "<sub style=\"font-size: 50%;\">" + level + "</sub>";
          nodeContent = currentFormat.brackets.open + subContent + firstContent + " " + secondContent + subContent + currentFormat.brackets.close;
          break;
  }

  return "<span style=\"font-size: " + currentFormat.fontSize + "; color: "+  currentFormat.color+ "; \">" + nodeContent + "</span>";
};