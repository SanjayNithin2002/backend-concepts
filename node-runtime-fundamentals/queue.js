console.log("A");

process.nextTick(() => console.log("B"));

Promise.resolve().then(() => {
    process.nextTick(() => console.log("C"));
    setTimeout(() => {
        console.log("D")
    }, 0);
    setImmediate(() => {
        console.log("E")
    })
})

process.nextTick(() => console.log("F"));

Promise.resolve().then(() => {
    console.log("G")
})

console.log("H")

// Output
// A
// H 
// B 
// F 
// G
// C 
// E 
// D
