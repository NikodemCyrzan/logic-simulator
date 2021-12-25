export class Circiut {
    public inputs: Array<Connection> = [];
    public outputs: Array<Connection> = [];
    public gates: Array<Gate>;

    constructor(inputsCount: number, outputsCount: number){
        this.inputs = new Array(inputsCount);
        this.outputs = new Array(outputsCount);
    }

    connectGateToInput(inputIndex: number, gate: Gate, gateInputIndex: number, connection: Connection = new Connection(0)){
        if (this.inputs[inputIndex] !== undefined){
            this.inputs[inputIndex].state = connection.state;
            gate.inputs[gateInputIndex] = this.inputs[inputIndex];
        }
        else {
            this.inputs[inputIndex] = connection;
            gate.inputs[gateInputIndex] = connection;
        }

        if (!gate.inputs.includes(undefined) && !gate.outputs.includes(undefined))
            gate.code(gate.inputs, gate.outputs);
    }
    connectGateToOutput(outputIndex: number, gate: Gate, gateOutputIndex: number, connection: Connection = new Connection(0)){
        if (this.outputs[outputIndex] !== undefined){
            this.outputs[outputIndex].state = connection.state;
            gate.outputs[gateOutputIndex] = this.outputs[outputIndex];
        }
        else {
            this.outputs[outputIndex] = connection;
            gate.outputs[gateOutputIndex] = connection;
        }

        if (!gate.inputs.includes(undefined) && !gate.outputs.includes(undefined))
            gate.code(gate.inputs, gate.outputs);
    }
    connectGates(outputGate: Gate, outputIndex: number, inputGate: Gate, inputIndex: number, connection: Connection = new Connection(0)){
        outputGate.createConnection(outputGate.outputs, outputIndex, inputGate.inputs, inputIndex, connection);

        if (!outputGate.inputs.includes(undefined) && !outputGate.outputs.includes(undefined))
            outputGate.code(outputGate.inputs, outputGate.outputs);
    }

    addInput(){
        this.inputs.push(undefined);
    }
    removeInput(index: number){
        this.inputs.splice(index, 1);
    }
    addOutput(){
        this.outputs.push(undefined);
    }
    removeOutput(index: number){
        this.outputs.splice(index, 1);
    }
}

export class Gate {
    public inputs: Array<Connection> = [];
    public outputs: Array<Connection> = [];

    public code: (inputs: Array<Connection>, outputs: Array<Connection>) => any;

    public createConnection(outputArray: Array<Connection> | null, outputIndex: number, inputArray: Array<Connection>, inputIndex: number, connection: Connection = new Connection(0)){
        if (inputArray != null){
            if (outputArray != null && outputArray[outputIndex] != undefined)
                inputArray[inputIndex] = outputArray[outputIndex];
            else
                inputArray[inputIndex] = connection;
        }
        if (outputArray != null){
            if (outputArray[outputIndex] != undefined)
                outputArray[outputIndex].state = connection.state;
            else
                outputArray[outputIndex] = connection;
        }

        if (!this.inputs.includes(undefined) && !this.outputs.includes(undefined))
            this.code(this.inputs, this.outputs);
    }

    constructor(code: (inputs: Array<Connection>, outputs: Array<Connection>) => any, inputsLength: number, outputsLength: number){
        this.inputs = new Array(inputsLength);
        this.outputs = new Array(outputsLength);
        this.code = code;
    }
}

export class Connection{
    public state: number;

    constructor(state: number = 0){
        this.state = state;
    }
}

const andCode = (inputs: Array<{state: number}>, outputs: Array<{state: number}>): any => {
    outputs[0].state = inputs[0].state == 1 && inputs[1].state == 1 ? 1 : 0;
}

const notCode = (inputs: Array<{state: number}>, outputs: Array<{state: number}>): any => {
    outputs[0].state = inputs[0].state == 0 ? 1 : 0;
};

export const AND = () => new Gate(andCode, 2, 1);
export const NOT = () => new Gate(notCode, 1, 1);