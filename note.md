-   [Title](#notes)
    -   [Basic Functions](<#Basic Functions>)
    -   [Recipes with Basic Functions](<#Recipes with Basic Functions>)
    -   [Choice and Truthiness](<#Choice and Truthiness>)
    -   [Composing and Decomposing Data](<#Composing and Decomposing Data>)
    -   [Recipes with Data](<#Recipes with Data>)
    -   [Basic Strings and Quasi-Literals](<#Basic Strings and Quasi-Literals>)
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

```js
function trueDat() {
	return true;
} // -> function declaration
(function trueDat() {
	return true;
}); // -> an expression
```

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

p148

-   Iterating

    We can accomplish any task with folds that could be accmplished with that stalwart of structured programming.

    Nevertheless, there's some value in being able to express some algorithm as iteration.

    low-level version of `for` loop, summing the elements of an array can be accomplished with:

    ```js
    const arraySum = (array) => {
    	let sum = 0;

    	for (let i = 0; i < array.length; ++i) {
    		sum += array[i];
    	}
    	return sum;
    };

    arraySum([1, 4, 9, 16, 25]); // => 55
    ```

    Once again, we're mixing the code for iterating over an array with the code for calculating a sum, and worst of all, we're getting really low-level with details.

    We can write this a slightly different way, using a while loop:

    ```js
    const arraySum = (array) => {
    	let done,
    		sum = 0,
    		i = 0;

    	while (((done = i == array.length), !done)) {
    		const value = array[i++];
    		sum += value;
    	}
    	return sum;
    };
    arraySum([1, 4, 9, 16, 25]); // => 55
    ```

    We can put `done` and `value` into POJO(plain old javascript object):

    ```js
    const arraySum = (array) => {
    	let iter,
    		sum = 0,
    		index = 0;

    	while (
    		((eachIteration = {
    			done: index === array.length,
    			value: index < array.length ? array[index] : undefined,
    		}),
    		++index,
    		!eachIteration.done)
    	) {
    		sum += eachIteration.value;
    	}
    	return sum;
    };

    arraySum([1, 4, 9, 16, 25]); // => 55
    ```

    we make a POJO that has `done` and `value`, all the summing code needs to know is add `eachIteration.value`, Now we can extract the ickiness into a separate function:

    ```js
    const arrayIterator = (array) => {
    	let i = 0;

    	return () => {
    		const done = i === array.length;

    		return {
    			done,
    			value: done ? undefined : array[i++],
    		};
    	};
    };

    const iteratorSum = (iterator) => {
    	let eachIteration,
    		sum = 0;

    	while (((eachIteration = iterator()), !eachIteration.done)) {
    		sum += eachIetration.value;
    	}
    	return sum;
    };

    iteratorSum(arrayIterator([1, 4, 9, 16, 25])); // => 55
    ```

    Here's one for linked lists:

    ```js
    const EMPTY = null;

    const isEmpty = (node) => node === EMPTY;

    const pair = (first, rest = EMPTY) => ({first, rest});

    const list = (...elements) => {
    	const [first, ...rest] = elements;

    	return elements.length === 0 ? EMPTY : pair(first, list(...rest));
    };

    const print = (aPair) =>
    	isEmpty(aPair) ? '' : `${aPair.first} ${print(aPair.rest)}`;

    const listIterator = (aPair) => () => {
    	const done = isEmpty(aPair);
    	if (done) {
    		return {done};
    	} else {
    		const {first, rest} = aPair;

    		aPair = aPair.rest;
    		return {done, value: first};
    	}
    };

    const iteratorSum = (iterator) => {
    	let eachIterationm;
    	sum = 0;

    	while (((eachIteration = iterator()), !eachIteration.done)) {
    		sum += eachIteration.value;
    	}
    	return sum;
    };

    iteratorSum(listIterator(list(1, 4, 9, 16, 25)));
    ```

p151

-   unfolding and laziness

    A function that starts with a seed and expands it into a data structure is called an _unfold_

    For starter, we can `map` an iterator:

    ```js
    const mapIteratorWith = (fn, iterator) => () => {
    	const {done, value} = iterator();

    	return {done, value: done ? undefined : fn(value)};
    };
    const squares = mapIteratorWith((x) => x * x, NumberIterator(1));

    squares().value; // => 1
    squares().value; // => 4
    ```

    here's another one:

    ```js
    const FibonacciIterator = () => {
    	let previous = 0,
    		current = 1;

    	return () => {
    		const value = current;

    		[previous, current] = [current, current + previous];
    		return {done: false, value};
    	};
    };
    const fib = FibonacciIterator();
    fib().value; // => 1
    fib().value; // => 2
    ```

    going on forever has some drawbacks. let's introduce an idea: a function that takes an iterator and returns another iterator.

    ```js
    const take = (iterator, numberToTake) => {
    	let count = 0;

    	return () => {
    		if (++count <= numberToTake) {
    			return iterator();
    		} else {
    			return {done: true};
    		}
    	};
    };

    const toArray = (iterator) => {
    	let eachIteration,
    		array = [];

    	while (((eachIteration = iterator()), !eachIteration.done)) {
    		array.push(eachIteration.value);
    	}
    	return array;
    };
    toArray(take(FibonacciIterator(), 5));
    // => [1, 1, 2, 3, 5]

    toArray(take(squares, 5));
    // => [1, 4, 9, 16, 25]
    ```

    how about the squares of the first five odd numbers

    ```js
    const odds = () => {
    	let number = 1;

    	return () => {
    		const value = number;

    		number += 2;
    		return {
    			done: false,
    			value,
    		};
    	};
    };

    const squareOf = callLeft(mapIteratorWith, (x) => x * x);

    toArray(take(squareOf(odds()), 5));
    // => [1, 9, 25, 49, 81]
    ```

    we could also write a filter for iterators to accompany our mapping function:

    ```js
    const filterIteratorWith = (fn, iterator) => () => {
    	do {
    		const {done, value} = iterator();
    	} while (!done && !fn(value));
    	return {done, value};
    };

    const oddsOf = callLeft(filterIteratorWith, (n) => n % 2 === 1);
    toArray(take(squareOf(oddsOf(NumberIterator(1))), 5));
    // => [1, 9, 25, 49, 81]
    ```

    filter:

    ```js
    const firstInIteration = (fn, iterator) =>
    	take(filterIteratorWith(fn, iterator), 1);
    ```

    This is interesting because it's lazy, doesn't apply `fn` to every element in an iteration. Whereas if we wrote something like:

    ```js
    const firstInArray = (fn, array) => array.filter(fn)[0];
    ```

    Javascript would apply `fn` to every element.

p156

-   Making Data out of function

    Arbitrary computations could be represented a small set of axiomatic components. For example, we don't need arrays to represent lists, or even POJOs to represent nodes in a linked list.

    Let's start with some of the building blocks of combinatory logic, the K, I and V combinators, nicknamed the 'Kestrel', the 'Idiot Bird', and the 'Vireo'

    ```js
    const K = (x) => (y) => x;
    const I = (x) => x;
    const V = (x) => (y) => (z) => z(x)(y);
    ```

-   The kestrel and the idiot

    A _constant_ function is a function that always returns the same thing, no matter what you give it.

    The kestrel, or K, is a function that makes constant functions. You give it a value, and it returns function that gives that value.

    ```js
    const K = (x) => (y) => x;

    const fortyTwo = K(42);
    fortyTwo(6); // => 42
    fortyTwo('hello'); // => 42

    K(6)(7); // => 6
    K(12)(24); // => 12
    ```

    The _identity_ function evaluates to whatever parameter you pass it. so `I(42) => 42`

    ```js
    K(I)(6)(7); // => 7
    K(I)(12)(24); // => 24

    const first = K,
    	second = K(I);

    first('primus')('secundus'); // => primus
    second('primus')('secundus'); // => secundus
    ```

-   backwardness

    ```js
    const latin = (selector) => selector('primus')('secundus');

    latin(first); // => 'primus'
    latin(second); // => 'secundus'
    ```

    latin is no longer a dumb data structure, it's a function, and it's exactly _backwards_ of the way we write functions that operatre on data.

-   the vireo

    ```js
    const first = K,
    	second = K(I),
    	pair = V;
    const latin = pair('primus')('secundus');

    latin(first); // => "primus"
    latin(second); // => "secundus"
    ```

p162

-   Lists with functions as data
    another look at linked list using POJOs

    ```js
    const first = ({first, rest}) => first,
    	rest = ({first, rest}) => rest,
    	pair = (first, rest) => ({first, rest}),
    	EMPTY = {};

    const l123 = pair(1, pair(2, pair(3, EMPTY)));

    first(l123); // => 1
    first(rest(l123)); // => 2
    first(rest(rest(l123))); // => 3
    ```

    we can write `length` and `mapWith` function over it:

    ```js
    const length = (aPair) => (aPair === EMPTY ? 0 : 1 + length(rest(aPair)));
    length(l123); // => 3

    const reverse = (aPair, delayed = EMPTY) =>
    	aPair === EMPTY
    		? delayed
    		: reverse(rest(aPair), pair(first(aPair), delayed));
    const mapWith = (fn, aPair, delayed = EMPTY) =>
    	aPair === EMPTY
    		? reverse(delayed)
    		: mapWith(fn, rest(aPair), pair(fn(first(aPair)), delayed));
    const doubled = mapWith((x) => x * 2, l123);
    ```

    Can we do the same with the linked lists we build out of functions ? Yes:

    ```js
    const first = K,
    	rest = K(I),
    	pair = V,
    	EMPTY = () => {};
    const l123 = pair(1)(pair(2)(pair(3)(EMPTY)));

    l123(first); // => 1
    l123(rest)(first); // => 2
    l123(rest)(rest)(first); // => 3
    ```

    we write them in a backwards way, but they seem to work. How about `length`?

    ```js
    const length = (aPair) => (aPair === EMPTY ? 0 : 1 + length(aPair(rest)));
    length(l123); // => 3
    ```

    And mapWith?

    ```js
    const reverse = (aPair, delayed = EMPTY) =>
    	aPair === EMPTY
    		? delayed
    		: reverse(aPair(rest), pair(aPair(first))(delayed));
    const mapWith = (fn, aPair, delayed = EMPTY) =>
    	aPair === EMPTY
    		? reverse(delayed)
    		: mapWith(fn, aPair(rest), pair(fn(aPair(first)))(delayed));
    const doubled = mapWith((x) => x * 2, l123);

    doubled(first); // => 2
    doubled(rest)(first); // => 4
    doubled(rest)(rest)(first); // => 6
    ```

    Presto, **we can use pure functions to represent a linked list.** In fact, anything that can be computed can be computed using just functions and nothing else.

p165

-   Say "please"

    Instead of asking a pair if it's empty and then deciding what to do, we can ask the pair to do it for us.

    ```js
    const pairFirst = K;
    const pairRest = K(I);
    const pair = V;

    const first = (list) =>
    	list(
    		() => "ERROR: Can't take first of an empty list",
    		(aPair) => aPair(pairFirst)
    	);

    const rest = (list) =>
    	list(
    		() => "ERROR: Can't take first of an empty list",
    		(aPair) => aPair(pairRest)
    	);

    const length = (list) =>
    	list(
    		() => 0,
    		(aPair) => 1 + length(aPair(pairRest))
    	);

    const print = (list) =>
    	list(
    		() => '',
    		(aPair) => `${aPair(pairFirst)} ${print(aPair(pairRest))}`
    	);

    const EMPTYLIST = (whenEmpty, unlessEmpty) => whenEmpty();

    const node = (x) => (y) => (whenEmpty, unlessEmpty) =>
    	unlessEmpty(pair(x)(y));

    const l123 = node(1)(node(2)(node(3)(EMPTYLIST)));

    const reverse = (list, delayed = EMPTYLIST) =>
    	list(
    		() => delayed,
    		(aPair) => reverse(aPair(pairRest), node(aPair(pairFirst))(delayed))
    	);

    const mapWith = (fn, list, delayed = EMPTYLIST) =>
    	list(
    		() => reverse(delayed),
    		(aPair) =>
    			mapWith(
    				fn,
    				aPair(pairRest),
    				node(fn(aPair(pairFirst)))(delayed)
    			)
    	);
    ```

p167

so what's interesting about this? what nags at our brain as we're falling asleep after working our way through this?

-   a return to backward thinking

    The exact implementation of a pair is hidden from the code that uses a pair.

    ```js
    const first = K,
    	second = K(I),
    	pair = (first) => (second) => {
    		const pojo = {first, second};

    		return (selector) => selector(pojo.first)(pojo.second);
    	};
    const latin = pair('primus')('secundus');
    latin(first); // => "primus"
    latin(second); // => "secundus"
    ```

    This is a little gratuitous, but it makes the point: the code that uses the data doesn't reach in and touch it.

    the same thing happends with our lists

    ```js
    const length = (list) =>
    	list(
    		() => 0,
    		(aPair) => 1 + length(aPair(pairRest))
    	);
    ```

    It's easy to see how to swap our functions out and replace them with an array. This is fundamenally not the same thing as this code for the length of a linked list:

    ```js
    const length = (node, delayed = 0) =>
    	node === EMPTY ? delayed : length(node.rest, delayed + 1);
    ```

    The line `node === EMPTY` presumes a lot of things. It presumes there is one canonical empty list value. It presumes you can compare these things with the `===` operator.

    Having a list know itself whether it's empty hide implementation infomation from the code that user lists. This is a fundamental principle of good design. It's a tenet of OOP, but it's **not** exclusive to OOP. We can and should design data structures to hide implementation information from the code that use them, whether we're working with functions, objects, or both.

    There are many tools for hiding implementation information, and we have now seen two particularly powerful patterns:

    -   Instead of directly manipulating part of an entity, pass it a function and have it call our function with the part we want.
    -   And instead of testing some property of an entity and making a choice of our own with `?:`(or `if`), pass the entity the work we want done for each case and let it test itself.

## Recipes with Data

p172

-   mapWith

    ```js
    const mapWith = (fn) => (list) => list.map(fn);
    ```

    `mapWith` differs from `map` in two ways: - It reverses the arguments - It also "curries" the function, that means you can pass a function to `mapWith` and get back a function that applies that mapping to any array.

    ```js
    const squareOf = mapWith((n) => n * n);
    ```

    we could also use `callRight`

    ```js
    const squareOf = callRight(map, (n) => n * n);
    ```

    Composing functions out of common pieces.

p174

-   Flip

    Let's consider the case whether we have a `map` function of our own, we could write:

    ```js
    const mapWith = (fn) => (list) => map(list, fn);
    ```

    What we have now is a function that takes a function and "flips" the order of arguments around.

    ```js
    const flipAndCurry = (fn) => (first) => (second) => fn(second, first);
    const flip = (fn) => (first, second) => fn(second, first);
    ```

    -   self-currying flip

        ```js
        const flip = (fn) =>
        	function (first, second) {
        		if (arguments.length === 2) {
        			return fn(second, first);
        		} else {
        			return function (second) {
        				return fn(second, first);
        			};
        		}
        	};
        const mapWith = flip(map);
        // mapWith(fn, list)
        // or, mapWith(fn)(list)
        ```

    -   flipping methods

        we see that `flip` throws the current context away, so it can't be used to flip methods. A small alteration gets the job done:

        ```js
        const flipAndCurry = (fn) => (first) =>
        	function (second) {
        		return fn.call(this, second, first);
        	};

        const flip = (fn) =>
        	function (first, second) {
        		return fn.call(this, second, first);
        	};

        const flip = (fn) =>
        	function (first, second) {
        		if (arguments.length === 2) {
        			return fn.call(this, second, first);
        		} else {
        			return function (second) {
        				return fn.call(this, second, first);
        			};
        		}
        	};
        ```

p177

-   Object.assign

    Assigning properties from one object to another(also called "cloning" or "shallow copying") is a basic building block.

    ```js
    const Queue = function () {
    	Object.assign(this, {
    		array: [],
    		head: 0,
    		tail: -1,
    	});
    };

    Object.assign(Queue.prototype, {
    	pushTail(value) {
    		// ...
    	},
    	pushHead(value) {
    		// ...
    	},
    	isEmpty() {
    		// ...
    	},
    });
    ```

p180

-   Why?

    This is the canonical Y Combinator

    ```js
    const Y = (f) => ((x) => f((v) => x(x)(v)))((x) => f((v) => x(x)(v)));
    ```

    You use it like this:

    ```js
    const factorial = Y(function (fac) {
    	return function (n) {
    		return n == 0 ? 1 : n * fac(n - 1);
    	};
    });

    factorial(5); // => 120
    ```

    This has little practical utility in JavaScript, but in combinatory logic it's essential: with the [fixed-point combinators](https://en.wikipedia.org/wiki/Fixed-point_combinator#Example_in_JavaScript) it's possible to compute everything computable without binding names(_names 应是指函数名_).

    _The joy of working things out_

    Resist any explanations of the Y Combinator's mechanism on the interet, work it out for youself.

    One tip: use JavaScript to name things

    ```js
    const Y = (f) => {
    	const something = (x) => f((v) => x(x)(v));

    	return something(something);
    };
    ```

    Another tip: Change some of the fat arrow functions inside of it into named function expression to help you decipher stack traces.

## Basic Strings and Quasi-Literals
