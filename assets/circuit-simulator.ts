export class Circuit {
    public inputs: Array<{state: number}> = [];
    public outputs: Array<{state: number}> = [];

    public code: (inputs: Array<{state: number}>, outputs: Array<{state: number}>) => any;

    /**
     * tworzy połączenie pomiędzy bramkami
     * @param inputArray tablica wejść bramki w której znajduje się pierwszy pin który ma zostać powiązany
     * @param inputIndex numer pinu w tablicy wejść pierwszej bramki
     * @param outputArray tablica wyjść bramki w której znajduje się drugi pin który ma zostać powiązany
     * @param outputIndex numer pinu w tablicy wyjść drugiej bramki
     * @param data objekt danych połączenia
     */
    public createConnection(outputArray: Array<{state: number}> | null, outputIndex: number, inputArray: Array<{state: number}>, inputIndex: number, data: {state: number} = {state: 0}){
        if (inputArray != null){
            if (outputArray != null && outputArray[outputIndex] != undefined)
                inputArray[inputIndex] = outputArray[outputIndex];
            else
                inputArray[inputIndex] = data;
        }
        if (outputArray != null){
            if (outputArray[outputIndex] != undefined)
                outputArray[outputIndex].state = data.state;
            else
                outputArray[outputIndex] = data;
        }

        if (!this.inputs.includes(undefined) && !this.outputs.includes(undefined))
            this.code(this.inputs, this.outputs);
    }

    constructor(code: (inputs: Array<{state: number}>, outputs: Array<{state: number}>) => any, inputsLength: number, outputsLength: number){
        this.inputs = new Array(inputsLength);
        this.inputs.fill(undefined, 0, inputsLength);
        this.outputs = new Array(outputsLength);
        this.outputs.fill(undefined, 0, outputsLength);
        this.code = code;
    }
}

const andCode = (inputs: Array<{state: number}>, outputs: Array<{state: number}>): any => {
    outputs[0].state = inputs[0].state == 1 && inputs[1].state == 1 ? 1 : 0;
}

const notCode = (inputs: Array<{state: number}>, outputs: Array<{state: number}>): any => {
    outputs[0].state = inputs[0].state == 0 ? 1 : 0;
};

export const AND = () => new Circuit(andCode, 2, 1);
export const NOT = () => new Circuit(notCode, 1, 1);
