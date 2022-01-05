"use strict";

class CircuitDOMElement {
  children = [];

  constructor(id, tag, instance, positioningFunction) {
    this.tag = tag;
    this.id = id;

    if (instance != undefined) {
      this.instance = instance;
    }

    if (positioningFunction != undefined) {
      this.positioningFunction = positioningFunction;
    }
  }

  removeInstance() {
    this.instance.destroy();

    for (let i = 0; i < this.children.length; i++) this.children[i].instance.destroy();
  }

  removeChild(id) {
    for (let i = 0; i < this.children.length; i++) if (this.children[i].instance.id == id) {
      this.children[i].removeInstance();
      this.children.splice(i, 1);
    }
  }

  addChild(element) {
    element.parent = this;
    if (element.positioningFunction != undefined) element.positioningFunction(element);
    this.children.push(element);
  }

  getElementById(id) {
    if (this.id == id) return this;

    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].id == id) return this.children[i];else {
        let element = this.children[i].getElementById(id);
        if (element != null) return element;
      }
    }

    return null;
  }

  getPosition() {
    return {
      x: this.instance.x(),
      y: this.instance.y()
    };
  }

  toSave() {
    let renderData = {};

    if (this.instance != null) {
      renderData["x"] = this.instance.x();
      renderData["y"] = this.instance.y();
      renderData["fill"] = this.instance.fill();
    } else renderData = null;

    return {
      id: this.id,
      children: this.children != null && this.children.length != 0 ? this.children.map(o => o.toSave()) : null,
      renderData: renderData
    };
  }

  addEventListener(event, code) {
    this.instance.on(event, code);
  }

}

class Circuit {
  id = generateUUID();

  constructor(name, DOM, inputsCount, outputsCount) {
    this.name = name;
    this.DOM = DOM;
    this.inputs = Array(inputsCount);
    this.outputs = Array(outputsCount);
  }

  toSave() {
    return {
      name: this.name,
      DOM: this.DOM.toSave(),
      inputs: this.inputs != null && this.inputs.length != 0 ? this.inputs.map(i => i.toSave()) : null,
      outputs: this.outputs != null && this.outputs.length != 0 ? this.outputs.map(c => c != null && c.length != 0 ? c.map(o => o.toSave()) : null) : null
    };
  }

  setInputConnection(connection, index) {
    this.inputs[index] = connection;
  }

  removeInputConnection(index) {
    this.inputs[index] = null;
  }

  setOutputConnection(connection, index) {
    if (this.outputs[index] == null) this.outputs[index] = [];
    this.outputs[index].push(connection);
  }

}

class Connection {
  constructor(state, outputParent, inputParent, instance) {
    this.state = state;
    this.outputParent = outputParent;
    this.inputParent = inputParent;
    this.instance = instance;
    this.updatePosition();
  }

  updatePosition() {
    this.instance.points(getLinePoints(this.inputParent.DOM.getPosition(), this.outputParent.DOM.getPosition()));
  }

  setState(state) {
    this.state = state;
  }

  toSave() {
    return {
      state: this.state,
      startPosition: this.inputParent.DOM.getPosition(),
      endPosition: this.outputParent.DOM.getPosition(),
      outputParentId: this.outputParent.id,
      inputParentId: this.inputParent.id
    };
  }

}

class Scene {
  circuits = [];

  constructor(inputs, outputs) {}

  addCircuit(circuit) {
    this.circuits.push(circuit);
  }

  getCircuit(id) {
    for (let i = 0; i < this.circuits.length; i++) if (this.circuits[i].id == id) return this.circuits[i];

    return null;
  }

  removeCircuit(id) {
    let circuit = this.getCircuit(id);

    if (circuit != null) {
      circuit.DOM.removeInstance();
      if (circuit.inputs != null) for (let i = 0; i < circuit.inputs.length; i++) delete circuit.inputs[i];
      if (circuit.outputs != null) for (let i = 0; i < circuit.outputs.length; i++) if (circuit.outputs[i] != null) delete circuit.outputs[i][0];
    }
  }

  connectInputToCircuit(inputIndex, circuitId, circuitInputIndex, state, instance) {
    let connection = new Connection(state, this.inputs[inputIndex], this.getCircuit(circuitId), instance);
    this.inputs[inputIndex].outputs[0].push(connection);
    this.getCircuit(circuitId).inputs[circuitInputIndex] = connection;
  }

  connectCircuits(outputIndex, outputCircuitId, inputIndex, inputCircuitId, state, instance) {
    let connection = new Connection(state, this.getCircuit(outputCircuitId), this.getCircuit(inputCircuitId), instance);
    this.getCircuit(outputCircuitId).outputs[outputIndex].push(connection);
    this.getCircuit(inputCircuitId).inputs[inputIndex] = connection;
  }

  connectOutputToCircuit(outputIndex, circuitId, circuitOutputIndex, state, instance) {
    let connection = new Connection(state, this.getCircuit(circuitId), this.outputs[outputIndex], instance);
    this.getCircuit(circuitId).outputs[circuitOutputIndex].push(connection);
    this.outputs[outputIndex].inputs[0] = connection;
  }

}

function getLinePoints(beg, end) {
  let xMul = beg.x < end.x ? -1 : 1;
  let yMul = beg.y > end.y ? -1 : 1;
  let xClamp = xMul * clamp(Math.abs(beg.x - end.x) / 40, 0, 1);
  return [beg.x, beg.y, end.x + 40 * xClamp, beg.y, end.x + 30 * xClamp, beg.y + 5 * yMul * clamp(Math.abs(beg.y - end.y) / 40, 0, 1), end.x + 25 * xClamp, beg.y + 15 * yMul * clamp(Math.abs(beg.y - end.y) / 40, 0, 1), end.x + 25 * xClamp, end.y - 15 * yMul * clamp(Math.abs(beg.y - end.y) / 40, 0, 1), end.x + 20 * xClamp, end.y - 5 * yMul * clamp(Math.abs(beg.y - end.y) / 40, 0, 1), end.x + 10 * xClamp, end.y, end.x, end.y];
}

function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

function generateUUID() {
  let d = new Date().getTime();
  let d2 = typeof performance !== 'undefined' && performance.now && performance.now() * 1000 || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16;

    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }

    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}

function colorBrightness(color) {
  let r, g, b, hsp;

  if (color.match(/^rgb/)) {
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }

  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp;
} //console.log(new Circuit("AND", new CircuitDOMElement("body", "Rect", undefined, undefined, new CircuitDOMElement("name", "Text")), 0, 0).toSave());