"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = exports.expect = void 0;

const expect = expected => {
  return {
    toBe(result) {
      if (result !== expected) throw new Error(`\n\tgot: ${expected}\n\texpected: ${result}`);
    }
  };
};

exports.expect = expect;

const test = async (title, callback) => {
  try {
    await callback();
    console.log(`✔ ${title}\n`);
  } catch (error) {
    console.log(`✖ ${title}\n`);
    console.log(`${error}\n`);
  }
};

exports.test = test;