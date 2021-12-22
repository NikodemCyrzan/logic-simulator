"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = exports.expect = void 0;

const expect = expected => {
  return {
    toBe(result) {
      if (result != expected) throw new Error(`\n\tgot: ${expected}\n\texpected: ${result}`);
    },
    toEqual(result) {
      if (result !== expected) throw new Error(`\n\tgot: ${expected}: ${typeof expected}\n\texpected: ${result}: ${typeof result}`);
    }
  };
};

exports.expect = expect;

const test = async (title, callback) => {
  try {
    await callback();
    console.log("\x1b[32m", `✔ ${title}`);
    console.log("\x1b[37m", "");
  } catch (error) {
    console.log("\x1b[31m", `✖ ${title}\n`);
    console.log("\x1b[37m", `${error}\n`);
  }
};

exports.test = test;