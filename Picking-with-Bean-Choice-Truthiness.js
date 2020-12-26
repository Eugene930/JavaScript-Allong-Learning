// * truthiness and operator
// * false: `fasle`, `null`, `undefined`, `NaN`, `0`, `''`

// * &&
// * 	-- if left-hand expression === falsy, return left-hand expression
// * 	-- else evaluates its right-hand expression, return right-hand expression

// * ||
// * 	-- if left-hand expression === truthy, return left-hand expression
// * 	-- else evaluates its right-hand expression, return right-hand expression
1 || 2; // => 1
null && undefined; // => null
undefined && null; // => undefined

const even = (n) => n === 0 || (n !== 1 && even(n - 2));

even(42); // true
even(41); // false
// -------------------------------
// -------------------------------

// * function parameters are eager
const or = (a, b) => a || b;
const and = (a, b) => a && b;
const even = (n) => or(n === 0, and(n !== 1, even(n - 2)));

even(42); // => Maximum call stack size exceeded
// ! Javascript always evaluates the expression for parameters before passing the values to a function to invoke.
// * have functions with control-flow semantics
const or = (a, b) => a() || b();
const and = (a, b) => a() && b();
const even = (n) =>
	or(
		() => n === 0,
		() =>
			and(
				() => n !== 1,
				() => even(n - 2)
			)
	);
even(7); // => false
