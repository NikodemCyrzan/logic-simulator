"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NOT = exports.Circuit = exports.AND = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Circuit {
  /**
   * tworzy połączenie pomiędzy bramkami
   * @param inputArray tablica wejść bramki w której znajduje się pierwszy pin który ma zostać powiązany
   * @param inputIndex numer pinu w tablicy wejść pierwszej bramki
   * @param outputArray tablica wyjść bramki w której znajduje się drugi pin który ma zostać powiązany
   * @param outputIndex numer pinu w tablicy wyjść drugiej bramki
   * @param data obiekt danych połączenia
   */
  createConnection(outputArray, outputIndex, inputArray, inputIndex) {
    let data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      state: 0
    };

    if (inputArray != null) {
      if (outputArray != null && outputArray[outputIndex] != undefined) inputArray[inputIndex] = outputArray[outputIndex];else inputArray[inputIndex] = data;
    }

    if (outputArray != null) {
      if (outputArray[outputIndex] != undefined) outputArray[outputIndex].state = data.state;else outputArray[outputIndex] = data;
    }

    if (!this.inputs.includes(undefined) && !this.outputs.includes(undefined)) this.code(this.inputs, this.outputs);
  }

  constructor(code, inputsLength, outputsLength) {
    _defineProperty(this, "inputs", []);

    _defineProperty(this, "outputs", []);

    this.inputs = new Array(inputsLength);
    this.inputs.fill(undefined, 0, inputsLength);
    this.outputs = new Array(outputsLength);
    this.outputs.fill(undefined, 0, outputsLength);
    this.code = code;
  }

}

exports.Circuit = Circuit;

const andCode = (inputs, outputs) => {
  outputs[0].state = inputs[0].state == 1 && inputs[1].state == 1 ? 1 : 0;
};

const notCode = (inputs, outputs) => {
  outputs[0].state = inputs[0].state == 0 ? 1 : 0;
};

const AND = () => new Circuit(andCode, 2, 1);

exports.AND = AND;

const NOT = () => new Circuit(notCode, 1, 1);

exports.NOT = NOT;
