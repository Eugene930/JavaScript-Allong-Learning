// * `const` is block level
((diameter) => {
  const PI = 3;

  if (true) {
    const PI = 3.14159265;

    return diameter * PI;
  }
})(2);
// ? => 6.2831853

((diameter) => {
  const PI = 3.14159265;

  if (true) {
    const PI = 3;
  }
  return diameter * PI;
})(2);
// ? => 6.2831853
// --------------------

// * function declaratios hoist
(function () {
  return fizzbuzz();

  //   const fizzbuzz = function fizzbuzz() {
  //     return "Fizz" + "Buzz";
  //   };
})();
// ? => undefined is not a function (evaluating 'fizzbuzz()')

(function () {
  return fizzbuzz();

  function fizzbuzz() {
    return 'Fizz' + 'Buzz';
  }
})();
// ? => "FizzBuzz"
// -----------------------

// * magic names(`this`) and fat arrows
(function () {
  return (function () {
    return arguments[0];
  })('inner');
})('outer');
// ? => "inner"

(function () {
  return (() => arguments[0])('inner');
})('outer');
// ? => "outer"
// ----------------------

// * mapWith | `map` from Underscore _map
const mapWith = (fn) => (array) => map(array, fn);

const row = function () {
  return mapWith((column) => column * arguments[0])([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
  ]);
};
row(3);
// ? => [3, 6, 9, ....

const row = function () {
  return mapWith(function (column) {
    return column * arguments[0];
  })([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
};
row(3);
// ? => [1, 4, 9, 16, 25, ...