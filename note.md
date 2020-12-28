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

    white folding is a special case of linear recursion, mapping is a special case of folding.

p97

- Tail Calls

    The `mapWith` and `foldWith` functions we wrote previously are not "production-ready". One of the reasons is that they consume memory propotional to the size of the array being fold.

    Better way: *tail-call optimization*, or "TCO"

    > a "tail-call" occurs when a function's last act is to invoke another function, and then return whatever the other function reutrns.
    
    > **If a function makes a call in tail position, JavaScript optimizes away the function call overhead and stack space.**

    The `length` function below is not a tail-call, because it return `1 + length(rest)`, not `length(rest)`
    ```js
    const length = ([first, ...rest]) => 
        first === undefined ? 0 : 1 + length(rest)
    ```

p100

- Converting non-tail-calls to tail-calls
    ```js
    const lengthDelaysWork = ([first, ...rest], numberToBeAdded) => 
        first === undefined 
            ? numberToBeAdded 
            : lengthDelaysWork(rest, 1 + numberToBeAddde)
    
    const length = (n) => 
        lengthDelaysWork(n, 0)
    ```
    Or we could use partial application:
    ```js
    const callLast = (fn, ...args) => 
        (...remainingArgs) =>
            fn(...remainingArgs, ...args)
    
    const length = callLast(lengthDelaysWork, 0)
    ```

    JavaScript optimizes that not to take up memory proportional to the length of the string ,We could use this technique with `mapWith`
    ```js
    const mapWithDelayWork = (fn, [first, ...rest], prepend) => 
        first === undefined
            ? prepend
            : mapWithDelayWork(fn, rest, [...prepend, fn(first)])
    
    const mapWith = callLast(mapWithDelayWork, [])
    ```

p102

- Default arugments

    - Factorials
        ```js
        const factorialWithDelayWork = (n, work) =>
            n === 1
            ? work
            : factorialWithDelayWork(n - 1, n * work)

        factorialWithDelayWork(1, 1) // => 1
        
        factorialWithDelayWork(5, 1) // => 120
        ```
    - use *default argument*
        ```js
        const factorial = (n, work = 1) => 
            n === 1 
            ? work
            : factorial(n - 1, n * work)
        ```
    - default desctructring
        ```js
        const [first, second = "two"] = ["one"]
        ```
    
p105

- Garbage, Garbage Everywhere
    
    The `mapWith` with tail-calls is still very slow on very large arrays.

    **Key Point**: Our `[first, ...rest]` approach to recursion is slow because that it creates a lot of temporary arrays, and it spends an enormous amount of time copying elements into arrays that end up being discarded.

    Linked lists are fast for a few things, like taking the front off a list, and taking the remainder of a list. But not for iterating over a list. (It's fast to iterate **forward** through a linked list, but linked list are constructed back-to-front.)


p111

- Plain Old JavaScript Objects

    Two objects created with separate evaluations have differing identities:
    ```js
    {year: 2012, month: 6, day: 14} === {year: 2012, month: 6, day: 14}
    // => false
    ```
    Names needn't be alphanumeric strings, for anything else, enclose the label in quotes.
