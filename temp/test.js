"use strict";

var _tester = require("../tester");

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a ** b;
}

(0, _tester.test)("dodawanie", () => {
  (0, _tester.expect)(add(2, 2)).toBe(4);
  (0, _tester.expect)(add(4, 5)).toBe(9);
  (0, _tester.expect)(add(254, 873)).toBe(1127);
}); // TESTY POWINNY ZAWIERAĆ PRZYNAJMNIEJ KILKA PRÓB

(0, _tester.test)("mnożenie 1", () => {
  (0, _tester.expect)(multiply(2, 2)).toBe(4);
});
(0, _tester.test)("mnożenie 2", () => {
  (0, _tester.expect)(multiply(2, 2)).toBe(4);
  (0, _tester.expect)(multiply(2, 8)).toBe(16);
  (0, _tester.expect)(multiply(4, 3)).toBe(12);
  (0, _tester.expect)(multiply(6, 2)).toBe(12);
}); // npm test -- tests/example.js
