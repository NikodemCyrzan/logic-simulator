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

// TESTY POWINNY ZAWIERAĆ PRZYNAJMNIEJ KILKA PRÓB
test("mnożenie 1", () => {
    expect(multiply(2, 2)).toBe(4);
})

// WYKRYTO BŁĄD
test("mnożenie 2", () => {
    expect(multiply(2, 2)).toBe(4);
    expect(multiply(2, 8)).toBe(16);
    expect(multiply(4, 3)).toBe(12);
    expect(multiply(6, 2)).toBe(12);
})

// npm test -- tests/example.js
