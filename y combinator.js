/**
 *
 * @param {higher-orader function} f
 *      @param {whatever function for recursiveness} function
 * @returns {function}
 *     - @param {varaible for operation and recursiveness} n
 */
const Y = (f) => {
	const something = function (x) {
		// js hoist the declaration, but not the assignment
		const inside = function (v) {
			return x(x)(v);
		};

		return f(inside);
	};

	return something(something);
};

const factorial = Y(function (fac) {
	return function (n) {
		return n === 0 ? 1 : n * fac(n - 1);
	};
});

console.log(factorial(5));
