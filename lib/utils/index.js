const isRegExp = obj =>
  Object.prototype.toString.call(obj) === "[object RegExp]";
const isString = obj => typeof obj === "string";

module.exports = {
  isRegExp,
  isString
};
