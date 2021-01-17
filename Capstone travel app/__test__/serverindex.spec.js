import { listening } from "../src/server/index.js"
// The describe() function takes two arguments - a string description, and a test suite as a callback function.  
// A test suite may contain one or more related tests    
describe("Testing the makeCall functionality", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.  
    test("Testing the makeCall function", () => {
        expect(listening).toBe(console.log('Example app listening on port 8081!'));
})});