## 1 First sip: Basic Functios

p22

- Functions containing no free variables are called pure functions.
- Functions containing free variables are called closures.
- A pure function can contain a closure.
- _"free variable"_ == _"non-local variable"_

p32

- Blocks also create scopes if `const` statement are within them.

p42

- Naming functions: If you don't need to name it anywhere else, you needn't.

p44

- Function declarations are not supposed to occur inside of blocks.
- Function declaration cannot exist inside of _any_ expression, otherwise it's a function expression.

p46

- Combinator: Higher-order pure functions that take only functions as arguments and return a function.
- _Compose_ | B combinator | "Bluebird":
  ```js
  const compose = (a, b) => (c) => a(b(c));
  ```
- Function decorator: higher-order function that takes one function as an argument, returns another function, and the returned function is a variation of the argument function.

p51

- _arguments_ is more like an object that happends to bind some values to properties with names that look like integers starting with zero.

p53

- Fat arrow functions are designed to be very lightweight and are often used with constructs like mapping or callbacks to emulate syntax

p61

- K Combinator (nicknamed "Kestrel")
  ```js
  const k = (x) => (y) => x;
  ```
