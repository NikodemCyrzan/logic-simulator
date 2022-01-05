type KonvaObject = {
    id: string; 
    remove: () => void;
    destroy: () => void;
    hide: () => void;
    show: () => void; 
    fill: (color?: string | null) => string | null; 
    x: (x?: number) => number;
    y: (y?: number) => number;
    points: (points?: Array<number>) => Array<number>;
    tension: (value?: number) => number;
    on: (event: CircuitEvent, code: () => void) => void;
};
type CircuitEvent = "click" | "dragstart" | "dragend" | "dragmove" | "mouseover" | "mouseenter" | "mouseleave";
type KonvaTag = "Rect" | "Line" | "Polygon" | "Text";

class CircuitDOMElement{
    tag: KonvaTag;
    id: string;
    instance: KonvaObject | undefined;
    positioningFunction: (element: CircuitDOMElement) => any;
    children: Array<CircuitDOMElement> = [];
    parent: CircuitDOMElement | null;

    constructor(id: string, tag?: KonvaTag, instance?: KonvaObject, positioningFunction?: (element: CircuitDOMElement) => any){
        this.tag = tag;
        this.id = id;
        
        if (instance != undefined){
            this.instance = instance;
        }

        if (positioningFunction != undefined){
            this.positioningFunction = positioningFunction;
        }
    }

    removeInstance(){
        this.instance.destroy();

        for (let i = 0; i < this.children.length; i++)
            this.children[i].instance.destroy();
    }

    removeChild(id: string){
        for (let i = 0; i < this.children.length; i++)
            if (this.children[i].instance.id == id){
                this.children[i].removeInstance();
                this.children.splice(i, 1);
            }
    }
    addChild(element: CircuitDOMElement){
        element.parent = this;
        if (element.positioningFunction != undefined)
            element.positioningFunction(element);
        this.children.push(element);
    }

    getElementById(id: string): CircuitDOMElement | null{
        if (this.id == id)
            return this;
        
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].id == id)
                return this.children[i];
            else {
                let element = this.children[i].getElementById(id);
                if (element != null)
                    return element;
            }
        }
        
        return null;
    }
    getPosition(): {x: number, y: number}{
        return {
            x: this.instance.x(),
            y: this.instance.y()
        }
    }

    toSave(): object{
        let renderData = {};

        if (this.instance != null){
            renderData["x"] = this.instance.x();
            renderData["y"] = this.instance.y();
            renderData["fill"] = this.instance.fill();
        }
        else
            renderData = null;

        return {
            id: this.id,
            children: this.children != null && this.children.length != 0 ?  this.children.map(o => o.toSave()) : null,
            renderData: renderData
        }
    }

    addEventListener(event: CircuitEvent, code: () => any){
        this.instance.on(event, code);
    }
}

class Circuit{
    public name: string;
    public id: string = generateUUID();
    public DOM: CircuitDOMElement | null;
    public inputs: Array<Connection | null>;
    public outputs: Array<Array<Connection | null> | null>;

    constructor(name: string, DOM: CircuitDOMElement, inputsCount: number, outputsCount: number){
        this.name = name;
        this.DOM = DOM; 
        this.inputs = Array(inputsCount);
        this.outputs = Array(outputsCount);
    }

    toSave(): object{
        return {
            name: this.name,
            DOM: this.DOM.toSave(),
            inputs: this.inputs != null && this.inputs.length != 0 ? this.inputs.map(i => i.toSave()) : null,
            outputs: this.outputs != null && this.outputs.length != 0 ? this.outputs.map(c => c != null && c.length != 0 ? c.map(o => o.toSave()) : null) : null
        };
    }

    setInputConnection(connection: Connection, index: number): void{
        this.inputs[index] = connection;
    }
    removeInputConnection(index: number): void{
        this.inputs[index] = null;
    }

    setOutputConnection(connection: Connection, index: number): void{
        if (this.outputs[index] == null)
            this.outputs[index] = [];

        this.outputs[index].push(connection);
    }
}

class Connection{
    public state: number;
    public outputParent: Circuit;
    public inputParent: Circuit;
    public instance: KonvaObject;

    constructor(state: number, outputParent: Circuit, inputParent: Circuit, instance: KonvaObject){
        this.state = state;
        this.outputParent = outputParent;
        this.inputParent = inputParent;
        this.instance = instance;
        this.updatePosition();
    }

    updatePosition(): void{
        this.instance.points(getLinePoints(this.inputParent.DOM.getPosition(), this.outputParent.DOM.getPosition()));
    }

    setState(state: number){
        this.state = state;
    }

    toSave(): object{
        return {
            state: this.state,
            startPosition: this.inputParent.DOM.getPosition(),
            endPosition: this.outputParent.DOM.getPosition(),
            outputParentId: this.outputParent.id,
            inputParentId: this.inputParent.id
        };
    }
}

class Scene{
    public inputs: Array<Circuit>;
    public outputs: Array<Circuit>;
    public circuits: Array<Circuit> = [];

    constructor(inputs: number, outputs: number){
        
    }

    addCircuit(circuit: Circuit): void{
        this.circuits.push(circuit);
    }
    getCircuit(id: string): Circuit | null{
        for (let i = 0; i < this.circuits.length; i++)
            if (this.circuits[i].id == id)
                return this.circuits[i];
        return null
    }
    removeCircuit(id: string): void{
        let circuit = this.getCircuit(id);
        if (circuit != null){
            circuit.DOM.removeInstance();

            if (circuit.inputs != null)
                for (let i = 0; i < circuit.inputs.length; i++)
                    delete circuit.inputs[i];

            if (circuit.outputs != null)
                for (let i = 0; i < circuit.outputs.length; i++)
                    if (circuit.outputs[i] != null)
                        delete circuit.outputs[i][0];
        }
    }

    connectInputToCircuit(inputIndex: number, circuitId: string, circuitInputIndex: number, state: number, instance: KonvaObject): void{
        let connection = new Connection(state, this.inputs[inputIndex], this.getCircuit(circuitId), instance);
        this.inputs[inputIndex].outputs[0].push(connection);
        this.getCircuit(circuitId).inputs[circuitInputIndex] = connection;
    }
    connectCircuits(outputIndex: number, outputCircuitId: string, inputIndex: number, inputCircuitId: string, state: number, instance: KonvaObject): void{
        let connection = new Connection(state, this.getCircuit(outputCircuitId), this.getCircuit(inputCircuitId), instance);
        this.getCircuit(outputCircuitId).outputs[outputIndex].push(connection);
        this.getCircuit(inputCircuitId).inputs[inputIndex] = connection;
    }
    connectOutputToCircuit(outputIndex: number, circuitId: string, circuitOutputIndex: number, state: number, instance: KonvaObject): void{
        let connection = new Connection(state, this.getCircuit(circuitId), this.outputs[outputIndex], instance);
        this.getCircuit(circuitId).outputs[circuitOutputIndex].push(connection);
        this.outputs[outputIndex].inputs[0] = connection;
    }
}

function getLinePoints(beg: {x: number, y: number}, end: {x: number, y: number}): Array<number>{
    let xMul = beg.x < end.x ? -1 : 1;
    let yMul = beg.y > end.y ? -1 : 1;

    let xClamp = xMul * clamp(Math.abs(beg.x - end.x) / 40, 0, 1);

    return [
        beg.x, beg.y, 
        end.x + 40 * xClamp, beg.y,
        end.x + 30 * xClamp, beg.y + 5 * yMul * clamp(Math.abs(beg.y - end.y) / 40, 0, 1),
        end.x + 25 * xClamp, beg.y + 15 * yMul * clamp(Math.abs(beg.y - end.y) / 40, 0, 1),
        end.x + 25 * xClamp, end.y - 15 * yMul * clamp(Math.abs(beg.y - end.y) / 40, 0, 1),
        end.x + 20 * xClamp, end.y - 5 * yMul * clamp(Math.abs(beg.y - end.y) / 40, 0, 1),
        end.x + 10 * xClamp, end.y,
        end.x, end.y
    ]
}

function clamp(value: number, min: number, max: number): number{
    return value < min ? min : value > max ? max : value;
}

function generateUUID(): string {
    let d: number = new Date().getTime();
    let d2: number = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r: number = Math.random() * 16;
        if(d > 0) {
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function colorBrightness(color: any): number {
    let r, g, b, hsp;
    
    if (color.match(/^rgb/)) {
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }

    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    return hsp;
}

//console.log(new Circuit("AND", new CircuitDOMElement("body", "Rect", undefined, undefined, new CircuitDOMElement("name", "Text")), 0, 0).toSave());