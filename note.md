-   [Title](#notes)
    -   [Basic Functions](<#Basic Functions>)
    -   [Recipes with Basic Functions](<#Recipes with Basic Functions>)
    -   [Choice and Truthiness](<#Choice and Truthiness>)
    -   [Composing and Decomposing Data](<#Composing and Decomposing Data>)
    -   [Recipes with Data]()
    -   [Basic Strings and Quasi-Literals]()
    -   [Objects and State]()
    -   [Recipes with Obejects Mutations, and State]()
    -   [Object-Oriented Programing]()
    -   [Collections]()
    -   [Symbols]()
    -   [Metaobjects]()
    -   [Impostors]()
    -   [Constructors and Classes]()
    -   [Recipes with Constructors and Classes]()
    -   [Symmetry, Color and Charm]()
    -   [Composing Class Behaviour]()
    -   [More Decorators]()
    -   [More Decorators Recipes]()
    -   [Final Remarks]()

---

# Notes

## Basic Functions

p12

-   `void`: we've generated undefined values in two ways:

    1. By evaluating a function that doesn't return a value(() => {}) and;
    2. By writing `undefined` ourselves;

    There's a third way, with javascript's `void` operator:

    ```js
    void 0;
    void 1;
    void (2 + 2);
    // => undefined
    ```

    this way are guaranteed to always work, and by convention use `void 0`

p22

-   Functions containing no free variables are called pure functions.
-   Functions containing free variables are called closures.
-   A pure function can contain a closure.
-   _"free variable"_ == _"non-local variable"_

p32

-   Blocks also create scopes if `const` statement are within them.

p42

-   Naming functions: If you don't need to name it anywhere else, you needn't.

p44

-   Function declarations are not supposed to occur inside of blocks.
-   Function declaration cannot exist inside of _any_ expression, otherwise it's a function expression.

p46

-   Combinator: Higher-order pure functions that take only functions as arguments and return a function.
-   _Compose_ | B combinator | "Bluebird":
    ```js
    const compose = (a, b) => (c) => a(b(c));
    ```
-   Function decorator: higher-order function that takes one function as an argument, returns another function, and the returned function is a variation of the argument function.

p51

-   _arguments_ is more like an object that happends to bind some values to properties with names that look like integers starting with zero.

p53

-   Fat arrow functions are designed to be very lightweight and are often used with constructs like mapping or callbacks to emulate syntax

---

## Recipes with Basic Functions

p61

-   Partial Application

    ```js
    const callFirst = (fn, larg) =>
    	function (...rest) {
    		return fn.call(this, larg, ...rest);
    	};
    ```

p59

-   Unary

    ```js
    const unary = (fn) =>
    	fn.length === 1
    		? fn
    		: function (something) {
    				return fn.call(this, something);
    		  };
    ```

p61

-   Tap: always return value, but if u pass it a function, it executes the functino for side-effects

    -   "K Combinator":
        ```js
        const k = (x) => (y) => x;
        ```
    -   Tap:

        ```js
        const tap = (value) => (fn) => (
        	typeof fn === 'function' && fn(value), value
        );
        ```

        -   enhanced:

        ```js
        const tap = (value, fn) => {
        	const curried = (fn) => (
        		typeof fn === 'function' && fn(value), value
        	);

        	return fn === undefined ? curried : curried(fn);
        };
        ```

p63

-   Maybe:checking for `null` or `undefined`

    ```js
    const maybe = (fn) =>
    	function (...args) {
    		if (args.length === 0) {
    			return;
    		} else {
    			for (let arg of args) {
    				if (arg == null) return;
    			}
    			return fn.apply(this, args);
    		}
    	};
    ```

p65

-   Once: ensures that a function can only be called once.

    ```js
    const once = (fn) =>
    	function () {
    		let done = false;

    		return function () {
    			return done
    				? void 0
    				: ((done = true), fn.apply(this, arguments));
    		};
    	};
    ```

p66

-   Left-variadic function: gathers parameters from the left, instead of from the right:

    ```js
    const leftVariadic = (fn) => {
    	if (fn.length < 1) {
    		return fn;
    	} else {
    		return function (...args) {
    			const gathered = args.slice(0, args.legnth - fn.length + 1),
    				spread = args.slice(0, args.length - fn.length + 1);

    			return fn.apply(this, [gathered].concat(spread));
    		};
    	}
    };
    ```

-   Left-variadic destructuring:

    ```js
    const leftGather = (outputArrayLength) => {
    	return function (inputArray) {
    		return [
    			inputArray.slice(0, inputArray.length - outputArrayLength + 1),
    		].concat(inputArray.length - outputArrayLength + 1);
    	};
    };
    ```

p71

-   Compose

    -   B combinator we saw before:
        ```js
        const compose = (a, b) => (c) => a(b(c));
        ```
    -   variadic compose and recursion

        ```js
        const compose = (a, ...res) => {
        	res.length === 0 ? a : (c) => a(compose(...res)(c));
        };
        ```

        other implementation:

        ```js
        const compose = (...fns) => (value) =>
        	fns.reverse().reduce((acc, fn) => fn(acc), value);
        ```

p73

-   Pipeline: as in "The value flows through a and then through b"

    ```js
    const pipeline = (...fns) => (value) =>
    	fns.reduce((arr, fn) => fn(arr), value);
    ```

---

## Choice and Truthiness

p77

-   `&&`

    -   if _left-hand expression_ === falsy, return _left-hand expression_
    -   else evaluates its _right-hand expression_, return _right-hand expression_

-   `||`
    -   if _left-hand expression_ === truthy, return _left-hand expression_
    -   else evaluates its _right-hand expression_, return _right-hand expression_
-   _Eagerly evaluated_: Javascript always evaluates the expression for parameters before passing the values to a function to invoke.

---

## Composing and Decomposing Data

p83

-   Array literals are expressions, and arrays are _reference types_. Each time an array literal is evaluated, we get a new, distinct array.
    ```js
    [] === undefined; // false
    ```
    ```js
    [] === []; // false
    ```
    ```js
    [2 + 2] === [2 + 2]; // false
    ```
    ```js
    const array_of_one = () => [1];
    array_of_one() === array_of_one(); // false
    ```
-   Self-similarity
    -   If a list is a self-similar, it's natural to create an algorithm that is also self-similar
        ```js
        const length = ([fisrt, ...rest]) =>
        	first === undefined ? 0 : 1 + length(rest);
        ```

p92

-   Linear recursion: simpler form of "divide and conquer".

    Dividing a problem into subproblems, detecting terminal cases, solving the terminal cases, and composing a solution from the solved portions.

    -   _Flatten_:
        terminal case: if an element is :

        1. empty array => will produce an empty array.
        2. isn't a array, don't flatten it, and put it together with the rest of our solution directly.
        3. an array, flatten and put it together with the rest.

        ```js
        const flatten = ([first, ...rest]) => {
        	if (first === undefined) {
        		return [];
        	} else if (!Array.isArray(first)) {
        		return [first, ...flatten(rest)];
        	} else {
        		return [...flatten(first), ...flatten(rest)];
        	}
        };
        ```

p94

-   _mapping_:
    ```js
    const mapWith = (fn, [first, ...rest]) => {
    	first === undefined ? [] : [fn(first), ...mapWith(fn, rest)];
    };
    ```

p95

-   _folding_:

    ```js
    const foldWith = (fn, terminalValue, [first, ...rest]) =>
    	first === undefined
    		? terminalValue
    		: fn(first, foldWith(fn, terminalValue, rest));

    foldWith((number, rest) => number * number + rest, 0, [1, 2, 3, 4, 5]); // => 55
    ```

    write `mapWith` using `foldWith`:

    ```js
    const mapWith = (fn, array) =>
    	foldWith((first, rest) => [fn(first), ...rest], [], array);
    ```

    write `length` with `foldWith`:

    ```js
    const length = (array) => foldWith((first, rest) => 1 + rest, 0, array);
    ```
