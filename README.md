# bason-funky
funky is a parser that makes writing programs in [BASON](https://github.com/DanFessler/bason) more friendly by adopting a familiar javascript-like function syntax

# Syntax
The syntax is universal and simple. Keyword (command, function, or variable) followed by its parameters in parenthesis, followed by its code block in curly brackets (if applicable):
~~~javascript
// comment
keyword (parameters, ...) {
  script...
}
~~~

defining functions in funky is also similar to javascript:
~~~javascript
FUNCTION GREET('name') {
  PRINT(ADD('Hello ', name))
}
GREET('World!')
~~~

Funky hoists functions for you so you can declare them anywhere in your file
~~~javascript
// still works!
GREET('World!')
FUNCTION GREET('name') {
  PRINT(ADD('Hello ', name))
}
~~~

# Installation
~~~
npm install bason-funky --save
~~~

# Usage
Import the package, define your program, and run it with `BASON.RUN()`
~~~javascript
let BASON = require('bason')
let funky = require('bason-funky')

BASON.RUN(funky.parse(`
  FUNCTION('TEST', 'name') {
    PRINT(ADD('Hello ', name))
  }
  TEST('World!')
`));
~~~
