import { test, expect } from '../tester';

function add(a, b){
    return a + b;
}

function multiply(a, b){
    return a ** b;
}

test("dodawanie", () => {
    expect(add(2, 2)).toBe(4);
    expect(add(4, 5)).toBe(9);
    expect(add(254, 873)).toBe(1127);
})

// TESTY POWINNY ZAWIERAĆ PRZYNAJMNIEJ KILKA PRÓB
test("mnożenie 1", () => {
    expect(multiply(2, 2)).toBe(4);
})

test("mnożenie 2", () => {
    expect(multiply(2, 2)).toBe(4);
    expect(multiply(2, 8)).toBe(16);
    expect(multiply(4, 3)).toBe(12);
    expect(multiply(6, 2)).toBe(12);
})

// npm test -- tests/example.js