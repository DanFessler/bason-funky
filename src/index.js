module.exports = {
  prettyPrint: function(json) {
    console.log(JSON.stringify(json,null,2));
  },

  parse: function(script, endLineToken, lineCount) {
    lineCount = lineCount? lineCount : 0;

    var startClosure = "{";
    var endClosure = "}";
    var closureCount = 0;

    var startParam = "(";
    var endParam = ")";
    var paramCount = 0;

    var newLine = "\n"
    var endLine = endLineToken? endLineToken : ";";

    var result = [];
    var lastIndex = 0;

    for (var i=0; i<script.length; i++) {

      // track script closure nesting
      if (script.charAt(i) == startClosure) closureCount++;
      if (script.charAt(i) == endClosure) closureCount--;

      // track parameter closure nesting
      if (script.charAt(i) == startParam) paramCount++;
      if (script.charAt(i) == endParam) paramCount--;

      // if we're not in the middle of a closure
      if (closureCount == 0 && paramCount == 0) {

        // Have we reached the end of the expression?
        if (script.charAt(i) == endClosure || script.charAt(i) == endLine || script.charAt(i) == newLine || i == script.length-1) {

          // If we have, save it as a string
          var string = script.substring(lastIndex, i+1).trim();

          // strip endLine terminator symbol
          if (string.charAt(string.length-1) == endLine) { string = string.substring(0,string.length-1);}

          // strip whitespace
          string = string.trim();

          // Increment our counters
          lineCount += script.charAt(i) == newLine ? 1 : 0;
          i++; lastIndex = i;

          // get params and script
          var lineParams = this.getClosure(string, "(", ")", true, 1);
          var lineScript = this.getClosure(string, "{", "}", true, 1);

          // get our key by removing parameters and code blocks from the expression
          var lineKey = string.replace(lineParams, '').replace(lineScript, '').trim();

          // parse the params and script without their closures
          if (lineParams) lineParams = this.parse(lineParams.substring(1,lineParams.length-1), ",", lineCount);
          if (lineScript) lineScript = this.parse(lineScript.substring(1,lineScript.length-1), ";", lineCount);

          // build our data object for this expression
          var line;

          // is it an empty line
          if (lineKey.length == 0) {

          }
          // is it a comment?
          else if (lineKey.substr(0,2) == "//") {
            line = null;
          }
          // is it a number literal?
          else if (!isNaN(lineKey)) {
            line = Number(lineKey);
            result.push(line);
          }
          // or a string literal?
          else if (this.isString(lineKey)) {
            line = lineKey.substring(1,lineKey.length-1);
            result.push(line);
          }
          // must be a key
          else {
            line = {};
            line[lineKey] = lineParams != null ? lineParams : null;
            if (lineScript) line.script = lineScript;
            line.line = lineCount;

            if (lineKey == "FUNCTION") result.unshift(line);
            else result.push(line);
          }

        }
      }
    }

    return result;
  },

  isString: function(string) {
    var result = false;
    if (
      (string.charAt(0) == "'" && string.charAt(string.length-1) == "'") ||
      (string.charAt(0) == '"' && string.charAt(string.length-1) == '"') )
    {
      result = true;
    }
    return result;
  },

  getClosure: function(string, startClosure, endClosure, includeClosure, limit) {

    // find the first closure
    var firstIndex = string.indexOf(startClosure);

    // if we didn't find one, then there are none, return null
    if (firstIndex == -1) return null

    var resultArray = [];
    var closureCount = 0;

    // walk through a string
    for (var i=firstIndex; i<string.length; i++) {

      if (string.charAt(i) == startClosure) closureCount++;
      if (string.charAt(i) == endClosure) closureCount--;

      if (closureCount == 0 ) {
        var returnstring = string.substring(firstIndex, i+1).trim();

        if (returnstring.length > 0) {

          // trim closures off string if needed
          if (!includeClosure) returnstring = returnstring.substr(1,returnstring.length-2).trim();

          // Push closure to result array
          resultArray.push(returnstring);
          if (limit && resultArray.length == limit) return limit == 1 ? returnstring : resultArray;

          // increment loop to next closure or break
          firstIndex = string.indexOf(startClosure, i);
          if (firstIndex != -1) {
            i = firstIndex;
            closureCount ++;
          }
          else {
            break;
          }
        }
      }

    }

    // if we have non-matching amount of start/end closures, report error
    if (closureCount != 0) console.error("Missing closure");

    return resultArray;
  },
}
