const fs = require("fs");
const readline = require("readline");

const Parser = require("./parser.js");


const file = fs.readFileSync("index.html").toString();


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


rl.setPrompt(">")
rl.prompt()







const parser = new Parser(file);
let tokens = parser.lexer()
// console.log(tokens)

let elementsTree = parser.parse();




let children = elementsTree.getChildren();


rl.on("line", (data)=>{
    // console.log(process.stdout.rows)
    // console.log
    console.log(elementsTree.getAllElements(elementsTree, data));
    rl.prompt();

});


// console.log(children)










// process.stdout.on("data", (data)=>{
//     console.log(data)
// })