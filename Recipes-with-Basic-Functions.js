// * Partial Application
const callFirst = (fn, larg) =>
	function (...rest) {
		return fn.call(this, larg, ...rest);
	};

const callLast = (fn, rarg) =>
	function (...rest) {
		return fn.call(this, ...rest, rarg);
	};

const callLeft = (fn, ...args) => (...remainingArgs) =>
	fn(...args, ...remainingArgs);

const callRight = (fn, ...args) => (...remainingArgs) =>
	fn(...remainingArgs, ...args);
// ---------------------------------
// ---------------------------------

// * Unary
const unary = (fn) =>
	fn.length === 1
		? fn
		: function (something) {
				return fn.call(this, something);
		  };

['1', '2', '3'].map(unary(parseInt));
// ? => [1, 2, 3]
// ---------------------------------------
// ---------------------------------------

// * K Combinator
// * always return value, but if u pass it a function, it executes the functino for side-effects.
const tap = (value) => (fn) => (typeof fn === 'function' && fn(value), value);

tap(
	'espresso'((it) => {
		console.log(`Our drink is '${it}'`);
	})
);
// ? => Our drink is 'espresso'
// ?    'espresso'

tap('espresso')();
// ? =>  'espresso'

// * enhance
const tap = (value, fn) => {
	const curried = (fn) => {
		typeof fn === 'function' && fn(value), value;
	};

	return fn === undefined ? curried : curried(fn);
};

tap('espresso')((it) => {
	console.log(`Our drink is '${it}'`);
});
// ? => Our drink is 'espresso'
// ?    'espresso'

tap('espresso', (it) => {
	console.log(`Our drink is '${it}'`);
});
// ? => Our drink is 'espresso'
// ?    'espresso'

// -------------------------------
// -------------------------------

// * Maybe

const isSomething = (value) => value !== null && value !== void 0;

const checksForSomething = (value) => {
	if (isSomething(value)) {
		// function's true logic
	}
};

var something = isSomething(value) ? doesntCheckForSomething(value) : value;

// * The function decorator for above, reduce the logic of checking for nothing to a function call.
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

maybe((a, b, c) => a + b + c)(1, 2, 3);
// ? => 6

maybe((a, b, c) => a + b + c)(1, null, 1);
// ? => undefined

function Model() {}

// * If some code ever tries to call model.setSomething with nothing, the operation will be skipped.
Model.prototype.setSomething = maybe(function (value) {
	this.something = value;
});

// ------------------------------
// ------------------------------

// * Once, it ensures a function can only be called once.

const once = (fn) => {
	let done = false;

	return function () {
		return done ? void 0 : ((done = true), fn.apply(this, arguments));
	};
};

const askedOnBlindDate = once(() => 'sure, why not?');

askedOnBlindDate();
// ? => 'sure, why not?'

askedOnBlindDate();
// ? => undefined

// --------------------------------
// --------------------------------

// * Left-Variadic Functions, designed to accept a variable number of arguments.

// * Right-Variadic function eg:
const abccc = (a, b, ...c) => {
	console.log(a);
	console.log(b);
	console.log(c);
};

abccc(1, 2, 3, 4, 5);
// 1, 2, [3, 4, 5]
// ! es6 only permits gethering parameters from the end of the parameter list.

const leftVariadic = (fn) => {
	if (fn.length < 1) {
		return fn;
	} else {
		return function (...args) {
			const gathered = args.slice(0, args.length - fn.length + 1),
				spread = args.slice(args.length - fn.length + 1);

			return fn.apply(this, [gathered].concat(spread));
		};
	}
};

const butLastAndLast = leftVariadic((butLast, last) => [butLast, last]);

butLastAndLast('why', 'hello', 'there', 'little', 'droid');
// ? => [['why', 'hello', 'there', 'little'], 'droid]

// * variadic compose and recursion

const compose = (a, ...rest) =>
	rest.length === 0 ? a : (c) => a(compose(...rest)(c));

// compose(a, b, c) ==>
//     (c1) => a(compose(b, c)(c1)) ==>
//         (c1) => a(((c2)=>b(compose(c)(c2)))(c1))
//             (c1) => a(((c2)=>b(c(c2))(c1))
//             (c1) => a((c1) => b(c(c1)))
//             (c1) => a(b(c(c1)))

// * another implementation
const compose = (...fns) => (value) =>
	fns.reverse().reduce((acc, fn) => fn(acc), value);
