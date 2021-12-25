import {expect, test} from '../tester';
import {AND, NOT, Connection} from '../build/circuit-simulator';

/////////////////////////////////////
// AND
/////////////////////////////////////

test("AND 1 1", () => {
    let a = AND();
    a.createConnection(null, 0, a.inputs, 0, new Connection(1));
    a.createConnection(null, 0, a.inputs, 1, new Connection(1));
    a.createConnection(a.outputs, 0, null, 0, new Connection(0));

    expect(a.outputs[0].state).toBe(1);
})

test("AND 0 1", () => {
    let a = AND();
    a.createConnection(null, 0, a.inputs, 0, new Connection(0));
    a.createConnection(null, 0, a.inputs, 1, new Connection(1));
    a.createConnection(a.outputs, 0, null, 0, new Connection(0));

    expect(a.outputs[0].state).toBe(0);
})
test("AND 0 0", () => {
    let a = AND();
    a.createConnection(null, 0, a.inputs, 0, new Connection(0));
    a.createConnection(null, 0, a.inputs, 1, new Connection(0));
    a.createConnection(a.outputs, 0, null, 0, new Connection(0));

    expect(a.outputs[0].state).toBe(0);
})

/////////////////////////////////////
// NOT
/////////////////////////////////////

test("NOT 1", () => {
    let a = NOT();
    a.createConnection(null, 0, a.inputs, 0, new Connection(1));
    a.createConnection(a.outputs, 0, null, 0, new Connection(0));

    expect(a.outputs[0].state).toBe(0);
});

test("NOT 0", () => {
    let a = NOT();
    a.createConnection(null, 0, a.inputs, 0, new Connection(0));
    a.createConnection(a.outputs, 0, null, 0, new Connection(0));

    expect(a.outputs[0].state).toBe(1);
});

/////////////////////////////////////
// AND -> NOT
/////////////////////////////////////

test("AND 1 1 -> NOT", () => {
    let a = AND();
    let b = NOT();

    a.createConnection(null, 0, a.inputs, 0, new Connection(1));
    a.createConnection(null, 0, a.inputs, 1, new Connection(1));
    a.createConnection(a.outputs, 0, b.inputs, 0, new Connection(0));
    b.createConnection(b.outputs, 0, null, 0, new Connection(0));

    expect(b.outputs[0].state).toBe(0);
});

test("AND 0 1 -> NOT", () => {
    let a = AND();
    let b = NOT();

    a.createConnection(null, 0, a.inputs, 0, new Connection(0));
    a.createConnection(null, 0, a.inputs, 1, new Connection(1));
    a.createConnection(a.outputs, 0, b.inputs, 0, new Connection(0));
    b.createConnection(b.outputs, 0, null, 0, new Connection(0));

    expect(b.outputs[0].state).toBe(1);
});

test("AND 0 0 -> NOT", () => {
    let a = AND();
    let b = NOT();

    a.createConnection(null, 0, a.inputs, 0, new Connection(0));
    a.createConnection(null, 0, a.inputs, 1, new Connection(0));
    a.createConnection(a.outputs, 0, b.inputs, 0, new Connection(0));
    b.createConnection(b.outputs, 0, null, 0, new Connection(0));

    expect(b.outputs[0].state).toBe(1);
});