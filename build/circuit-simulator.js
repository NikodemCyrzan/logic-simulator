"use strict";

class Circuit {
  inputs = [];
  outputs = [];

  constructor(inputsCount, outputsCount) {
    this.inputs = new Array(inputsCount);
    this.outputs = new Array(outputsCount);
  }

  connectGateToInput(inputIndex, gate, gateInputIndex, connection = new Connection(0)) {
    if (this.inputs[inputIndex] !== undefined) {
      this.inputs[inputIndex].state = connection.state;
      gate.inputs[gateInputIndex] = this.inputs[inputIndex];
    } else {
      this.inputs[inputIndex] = connection;
      gate.inputs[gateInputIndex] = connection;
    }

    if (!gate.inputs.includes(undefined) && !gate.outputs.includes(undefined)) gate.code(gate.inputs, gate.outputs);
  }

  connectGateToOutput(outputIndex, gate, gateOutputIndex, connection = new Connection(0)) {
    if (this.outputs[outputIndex] !== undefined) {
      this.outputs[outputIndex].state = connection.state;
      gate.outputs[gateOutputIndex] = this.outputs[outputIndex];
    } else {
      this.outputs[outputIndex] = connection;
      gate.outputs[gateOutputIndex] = connection;
    }

    if (!gate.inputs.includes(undefined) && !gate.outputs.includes(undefined)) gate.code(gate.inputs, gate.outputs);
  }

  connectGates(outputGate, outputIndex, inputGate, inputIndex, connection = new Connection(0)) {
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

class Gate {
  inputs = [];
  outputs = [];

  createConnection(outputArray, outputIndex, inputArray, inputIndex, connection = new Connection(0)) {
    if (inputArray != null) {
      if (outputArray != null && outputArray[outputIndex] != undefined) inputArray[inputIndex] = outputArray[outputIndex];else inputArray[inputIndex] = connection;
    }

    if (outputArray != null) {
      if (outputArray[outputIndex] != undefined) outputArray[outputIndex].state = connection.state;else outputArray[outputIndex] = connection;
    }

    if (!this.inputs.includes(undefined) && !this.outputs.includes(undefined)) this.code(this.inputs, this.outputs);
  }

  constructor(code, inputsLength, outputsLength) {
    this.inputs = new Array(inputsLength);
    this.outputs = new Array(outputsLength);
    this.code = code;
  }

}

class Connection {
  inGates = [];

  constructor(state = 0, inGate, outGate) {
    this.state = state;
    if (inGate != undefined) this.inGates.push(inGate);
    if (outGate != undefined) this.outGate = outGate;
  }

  setState(state) {
    this.state = state;
    if (this.inGates.length != 0) for (let i = 0; i < this.inGates.length; i++) if (!this.inGates[i].inputs.includes(undefined) && !this.inGates[i].outputs.includes(undefined)) this.inGates[i].code(this.inGates[i].inputs, this.inGates[i].outputs);
  }

}

const andCode = (inputs, outputs) => {
  outputs[0].setState(inputs[0].state == 1 && inputs[1].state == 1 ? 1 : 0);
};

const notCode = (inputs, outputs) => {
  outputs[0].setState(inputs[0].state == 0 ? 1 : 0);
};

const AND = () => new Gate(andCode, 2, 1);

const NOT = () => new Gate(notCode, 1, 1);