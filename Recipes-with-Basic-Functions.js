const callFirst = (fn, larg) =>
  function (...rest) {
    return fn.call(this, larg, ...rest);
  };

const callLast = (fn, rarg) =>
  function (...rest) {
    return fn.call(this, ...rest, rarg);
  };
