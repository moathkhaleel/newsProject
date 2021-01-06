import { inputChecker } from "../src/client/js/inputChecker"

describe("Testing the inputchecker functionality", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.  
    test("Testing the inputchecker function", () => {
        const input = "hi"
        expect(inputChecker(input)) == true;
})});