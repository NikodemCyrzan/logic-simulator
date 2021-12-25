import { test, expect } from '../tester';

function add(a, b){
    return a + b;
}

function multiply(a, b){
    return a ** b;
}

test("dodawanie", () => {
    // toBe sprawdza czy wartość jest taka sama
    expect(add(2, 2)).toBe("4");
    // toEqual sprawdza czy wartość i typ są takie same
    expect(add(4, 5)).toEqual(9);
    expect(add(254, 873)).toEqual("1127");
})

test("mnożenie 2 * 2", () => {
    expect(multiply(2, 2)).toBe(4);
})

// WYKRYTO BŁĄD
test("mnożenie 2 * 3", () => {
    expect(multiply(2, 3)).toBe(6);
})

// npm test -- tests/example.test.js
