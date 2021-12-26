"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NOT = exports.Gate = exports.Connection = exports.Circuit = exports.AND = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Circuit {
  constructor(inputsCount, outputsCount) {
    _defineProperty(this, "inputs", []);

    _defineProperty(this, "outputs", []);

    this.inputs = new Array(inputsCount);
    this.outputs = new Array(outputsCount);
  }

  connectGateToInput(inputIndex, gate, gateInputIndex) {
    let connection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Connection(0);

    if (this.inputs[inputIndex] !== undefined) {
      this.inputs[inputIndex].state = connection.state;
      gate.inputs[gateInputIndex] = this.inputs[inputIndex];
    } else {
      this.inputs[inputIndex] = connection;
      gate.inputs[gateInputIndex] = connection;
    }

    if (!gate.inputs.includes(undefined) && !gate.outputs.includes(undefined)) gate.code(gate.inputs, gate.outputs);
  }

  connectGateToOutput(outputIndex, gate, gateOutputIndex) {
    let connection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Connection(0);

    if (this.outputs[outputIndex] !== undefined) {
      this.outputs[outputIndex].state = connection.state;
      gate.outputs[gateOutputIndex] = this.outputs[outputIndex];
    } else {
      this.outputs[outputIndex] = connection;
      gate.outputs[gateOutputIndex] = connection;
    }

    if (!gate.inputs.includes(undefined) && !gate.outputs.includes(undefined)) gate.code(gate.inputs, gate.outputs);
  }

  connectGates(outputGate, outputIndex, inputGate, inputIndex) {
    let connection = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Connection(0);
    outputGate.createConnection(outputGate.outputs, outputIndex, inputGate.inputs, inputIndex, connection);
    if (!outputGate.inputs.includes(undefined) && !outputGate.outputs.includes(undefined)) outputGate.code(outputGate.inputs, outputGate.outputs);
  }

  addInput() {
    this.inputs.push(undefined);
  }

  removeInput(index) {
    this.inputs.splice(index, 1);
  }

  addOutput() {
    this.outputs.push(undefined);
  }

  removeOutput(index) {
    this.outputs.splice(index, 1);
  }

}

exports.Circuit = Circuit;

class Gate {
  createConnection(outputArray, outputIndex, inputArray, inputIndex) {
    let connection = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Connection(0);

    if (inputArray != null) {
      if (outputArray != null && outputArray[outputIndex] != undefined) inputArray[inputIndex] = outputArray[outputIndex];else inputArray[inputIndex] = connection;
    }

    if (outputArray != null) {
      if (outputArray[outputIndex] != undefined) outputArray[outputIndex].state = connection.state;else outputArray[outputIndex] = connection;
    }

    if (!this.inputs.includes(undefined) && !this.outputs.includes(undefined)) this.code(this.inputs, this.outputs);
  }

  constructor(code, inputsLength, outputsLength) {
    _defineProperty(this, "inputs", []);

    _defineProperty(this, "outputs", []);

    this.inputs = new Array(inputsLength);
    this.outputs = new Array(outputsLength);
    this.code = code;
  }

}

exports.Gate = Gate;

class Connection {
  constructor() {
    let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let inGate = arguments.length > 1 ? arguments[1] : undefined;
    let outGate = arguments.length > 2 ? arguments[2] : undefined;

    _defineProperty(this, "inGates", []);

    this.state = state;
    if (inGate != undefined) this.inGates.push(inGate);
    if (outGate != undefined) this.outGate = outGate;
  }

  setState(state) {
    this.state = state;
    if (this.inGates.length != 0) for (let i = 0; i < this.inGates.length; i++) if (!this.inGates[i].inputs.includes(undefined) && !this.inGates[i].outputs.includes(undefined)) this.inGates[i].code(this.inGates[i].inputs, this.inGates[i].outputs);
  }

}

exports.Connection = Connection;

const andCode = (inputs, outputs) => {
  outputs[0].setState(inputs[0].state == 1 && inputs[1].state == 1 ? 1 : 0);
};

const notCode = (inputs, outputs) => {
  outputs[0].setState(inputs[0].state == 0 ? 1 : 0);
};

const AND = () => new Gate(andCode, 2, 1);

exports.AND = AND;

const NOT = () => new Gate(notCode, 1, 1);

exports.NOT = NOT;
let circuit = new Circuit(4, 1);
let leftAnd1 = AND();
let leftAnd2 = AND();
let rightAnd = AND();
circuit.connectGateToInput(0, leftAnd1, 0, new Connection(0, leftAnd1));
circuit.connectGateToInput(1, leftAnd1, 1, new Connection(0, leftAnd1));
circuit.connectGateToInput(2, leftAnd2, 0, new Connection(0, leftAnd2));
circuit.connectGateToInput(3, leftAnd2, 1, new Connection(0, leftAnd2));
circuit.connectGates(leftAnd1, 0, rightAnd, 0, new Connection(0, rightAnd, leftAnd1));
circuit.connectGates(leftAnd2, 0, rightAnd, 1, new Connection(0, rightAnd, leftAnd2));
circuit.connectGateToOutput(0, rightAnd, 0, new Connection(0, null, rightAnd));
console.log(circuit.outputs[0]);
circuit.inputs[0].setState(1);
circuit.inputs[1].setState(1);
circuit.inputs[2].setState(1);
circuit.inputs[3].setState(1);
console.log(circuit.outputs[0]);