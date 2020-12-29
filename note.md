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

-   Tail Calls

    The `mapWith` and `foldWith` functions we wrote previously are not "production-ready". One of the reasons is that they consume memory propotional to the size of the array being fold.

    Better way: _tail-call optimization_, or "TCO"

    > a "tail-call" occurs when a function's last act is to invoke another function, and then return whatever the other function reutrns.

    > **If a function makes a call in tail position, JavaScript optimizes away the function call overhead and stack space.**

    The `length` function below is not a tail-call, because it return `1 + length(rest)`, not `length(rest)`

    ```js
    const length = ([first, ...rest]) =>
    	first === undefined ? 0 : 1 + length(rest);
    ```

p100

-   Converting non-tail-calls to tail-calls

    ```js
    const lengthDelaysWork = ([first, ...rest], numberToBeAdded) =>
    	first === undefined
    		? numberToBeAdded
    		: lengthDelaysWork(rest, 1 + numberToBeAddde);

    const length = (n) => lengthDelaysWork(n, 0);
    ```

    Or we could use partial application:

    ```js
    const callLast = (fn, ...args) => (...remainingArgs) =>
    	fn(...remainingArgs, ...args);

    const length = callLast(lengthDelaysWork, 0);
    ```

    JavaScript optimizes that not to take up memory proportional to the length of the string ,We could use this technique with `mapWith`

    ```js
    const mapWithDelayWork = (fn, [first, ...rest], prepend) =>
    	first === undefined
    		? prepend
    		: mapWithDelayWork(fn, rest, [...prepend, fn(first)]);

    const mapWith = callLast(mapWithDelayWork, []);
    ```

p102

-   Default arugments

    -   Factorials

        ```js
        const factorialWithDelayWork = (n, work) =>
        	n === 1 ? work : factorialWithDelayWork(n - 1, n * work);

        factorialWithDelayWork(1, 1); // => 1

        factorialWithDelayWork(5, 1); // => 120
        ```

    -   use _default argument_
        ```js
        const factorial = (n, work = 1) =>
        	n === 1 ? work : factorial(n - 1, n * work);
        ```
    -   default desctructring
        ```js
        const [first, second = 'two'] = ['one'];
        ```

p105

-   Garbage, Garbage Everywhere

    The `mapWith` with tail-calls is still very slow on very large arrays.

    **Key Point**: Our `[first, ...rest]` approach to recursion is slow because that it creates a lot of temporary arrays, and it spends an enormous amount of time copying elements into arrays that end up being discarded.

    Linked lists are fast for a few things, like taking the front off a list, and taking the remainder of a list. But not for iterating over a list. (It's fast to iterate **forward** through a linked list, but linked list are constructed back-to-front.)

p111

-   Plain Old JavaScript Objects

    Two objects created with separate evaluations have differing identities:

    ```js
    {year: 2012, month: 6, day: 14} === {year: 2012, month: 6, day: 14}
    // => false
    ```

    Names needn't be alphanumeric strings, for anything else, enclose the label in quotes.

p117

-   linked list are constructed back-to-front.

    naively copying (front-to-back):

    ```js
    const slowcopy = (node) =>
    	node === EMPTY ? EMPTY : {first: node.first, rest: slowcopy(node.rest)};
    ```

    reverse the list (back-to-front):

    ```js
    const reverse = (node, delayed = EMPTY) =>
    	node === EMPTY
    		? delayed
    		: reverse(node.rest, {first: node.first, rest: delayed});
    ```

    reversing map:

    ```js
    const reverseMapWith = (fn, node, delayed = EMPTY) =>
    	node === EMPTY
    		? delayed
    		: reverseMapWith(fn, node.rest, {
    				first: fn(node.first),
    				rest: delayed,
    		  });
    ```

    and a regular mapWith follows:(take as twice as long as a straight iteration)

    ```js
    const mapWith = (fn, node, delayed = EMPTY) =>
    	node === EMPTY
    		? reverse(delayed)
    		: mapWith(fn, node.rest, {first: fn(node.first, (rest: delayed))});
    ```

    This is still much faster than making partial copies of arrays.(we aren't making a new list, but getting a reference.)

p120

-   Mutation
    nothing happend cause we just rebind the name within innter environment:

    ```js
    const allHallowsEve = [2012, 10, 31];
    (function (halloween) {
    	halloween = [2013, 10, 31];
    })(allHallowsEve);
    allHallowsEve; // => [2012, 10, 32]
    ```

    However, what happends if we _mutate_ the value in the inner environment?

    ```js
    const allHallowsEve = [2012, 10, 31];
    (function (halloween) {
    	halloween[0] = 2013;
    })(allHallowsEve);
    allHallowsEve; // => [2013, 10, 31]
    ```

    In general, mutation makes some algorithms shorter to write and possibly faster, but harder to reason about.

    The gathering operation is slower, but "safer".

    We just use the data, and the less we mutate it, the fewer the times we have to think about whether making changes will be "safe".

p128

-   `let` works like `const`, but permits us to rebind variables.

    we should always declare and bind names before using them. JavaScript hoists the declaration, but not the assignment.

p140

-   some utilities

    ```js
    const copy = (node, head = null, tail = null) => {
    	if (node === EMPTY) {
    		return head;
    	} else if (tail === null) {
    		const {first, rest} = node;
    		const newNode = {first, rest};
    		return copy(rest, newNode, newNode);
    	} else {
    		const {first, rest} = node;
    		const newNode = {first, rest};
    		tail.rest = newNode;
    		return copy(node.rest, head, newNode);
    	}
    };
    const set = (index, value, list, originalList = list) =>
    	index === 0
    		? ((list.first = value), originalList)
    		: set(index - 1, value, rest(list), originalList);
    ```

-   copy-on-read

    This's expensvie and there's also a bug(modify the first element of list).

    ```js
    const rest = ({first, rest}) => copy(rest);

    const parentList = {
    	first: 1,
    	rest: {first: 2, rest: {first: 3, rest: EMPTY}},
    };
    const childList = rest(parentList);

    const newParentList = set(2, 'three', parentList);
    set(0, 'two', childList);

    parentList; // => {"first": 1, "rest": {"first":2, "rest": {"first": "three" ,...}}}
    childList; // => {"first": "two", ...}
    ```

-   copy-on-write

    waiting to copy until you are writing -- copy-on-write, or "COW"

    it's much cheaper than pessimistically copying structures when u make an infrequent number of small changes, but if you tend to make a lot of changes to some that you aren't sharing, it's more expensive.

    ```js
    const rest = ({first, rest}) => rest;
    const set = (index, value, list) =>
    	index === 0
    		? {first: value, rest: list.rest}
    		: {first: list.first, rest: set(index - 1, value, list.rest)};

    const parentList = {
    	first: 1,
    	rest: {first: 2, rest: {first: 3, rest: EMPTY}},
    };
    const childList = rest(parentList);

    const newParentLIst = set(2, 'three', parentList);
    const newChildList = set(0, 'two', childList);

    parentList; // => not changed
    childList; // => not changed
    ```

p143

-   Tortoises, Hares, and Teleporting Turtles

    detect a loop in a linked list, in constant space.

    "How to traverse a data structure, and what to do with the elements that you encounter."

    ```js
    const EMPTY = null;

    const isEmpty = (node) => node === EMPTY;

    const pair = (first, rest = EMPTY) => ({first, rest});

    const list = (...elements) => {
    	const [first, ...rest] = elements;

    	return elements.length === 0 ? EMPTY : pair(first, list(...rest));
    };

    const forceAppend = (list1, list2) => {
    	if (isEmpty(list1)) {
    		return 'FAIL!';
    	}
    	if (isEmpty(list1.rest)) {
    		list1.rest = list2;
    	} else {
    		forceAppend(list1.rest, list2);
    	}
    };

    // 类似龟兔赛跑，如果存在循环，跑得更快的兔子会在循环的某一点与乌龟相遇
    const tortoiseAndHare = (aPair) => {
    	let tortoisePair = aPair,
    		harePair = aPair.rest;

    	while (true) {
    		if (isEmpty(tortoisePair) || isEmpty(harePair)) {
    			return false;
    		}
    		if (tortoisePair.first === harePair.first) {
    			return true;
    		}

    		harePair = harePair.rest;

    		if (isEmpty(harePair)) {
    			return false;
    		}
    		if (tortoisePair.first === harePair.first) {
    			return true;
    		}

    		tortoisePair = tortoisePair.rest;
    		harePair = harePair.rest;
    	}
    };

    const aList = list(1, 2, 3, 4, 5);

    tortoiseAndHare(aList); // => false

    forceAppend(aList, aList.rest.rest);

    tortoiseAndHare(aList); // => true
    ```

p146

-   Functional Iterators

    a simple problem: "Finding the sum of the elements of an array"

    In tail-recursive style, it looks like:

    ```js
    const arraySum = ([first, ...rest], accumulator = 0) =>
    	first === undefined ? accumulator : arraySum(rest, first + accumulator);
    arraySum([1, 4, 9, 16, 25]); // => 55
    ```

    Above code entangles the mechanism of travering the array with the bussiness of summing the bits, so we can seperate them using _fold_:

    ```js
    const callLeft = (fn, ...args) => (...remainingArgs) =>
    	fn(...args, ...remainingArgs);

    const foldArrayWith = (fn, terminalValue, [first, ...rest]) =>
    	first === undefined
    		? terminalValue
    		: fn(first, foldArrayWith(fn, terminalValue, rest));
    const arraySum = callLeft(foldArrayWith, (a, b) => a + b, 0);
    arraySum([1, 4, 9, 16, 25]); // => 55
    ```

    But it still relies on `foldArrayWith`, so it can only sum arrays. The `arraySum` has baked into it a method for traversing a array, perhaps we could extract both of those things. Let's rearrange our code a bit:

    ```js
    const callRight = (fn, ...args) => (...remainingArgs) =>
    	fn(...remainArgs, ...args);

    const foldArrayWith = (fn, terminalValue, [first, ...rest]) =>
    	first === undefined
    		? terminalValue
    		: fn(first, foldArrayWith(fn, terminalValue, rest));

    const foldArray = (array) => callRight(foldArrayWith, array);

    const sumFoldable = (folder) => folder((a, b) => a + b, 0);

    sumFoldable(foldArray([1, 4, 9, 16, 25])); // => 55
    ```

    What we do is turn an array into a function that folds an array. The `sumFoldable` function doesn't care what kind of data structure we have, as long as it's foldable.

    Here it's summing a tree of numbers:

    ```js
    const callRight = (fn, ...args) => (...remianingArgs) =>
    	fn(...remianingArgs, ...args);

    const foldTreeWith = (fn, terminalValue, [first, ...rest]) =>
    	first === undefined
    		? terminalValue
    		: Array.isArray(first)
    		? fn(
    				foldTreeWith(fn, terminalValue, first),
    				foldTreeWith(fn, terminalValue, rest)
    		  )
    		: fn(first, foldTreeWith(fn, terminalValue, rest));

    const foldTree = (tree) => callRight(foldTreeWith, tree);

    const sumFoldable = (folder) => folder((a, b) => a + b, 0);

    sumFoldable(foldTree([1, [4, [9, 16]], 25])); // => 5
    ```

    We've separated the knowledge of how to sum from the knowledge of how to fold an array or tree(or anything else, really).
