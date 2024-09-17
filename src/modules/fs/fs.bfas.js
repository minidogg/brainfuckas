const fs = require("fs");
const path = require("path");
const moduleClass = require("../module_class.js")

let inBytes = []
let outBytes = []
let curPath = "./default.txt"

function Write(byte){
    inBytes.push(byte)
}
function Read(){
    return outBytes.shift();
}
function Call(){
    outBytes = []
    switch(inBytes[0]){
        // Set path name
        case(0):
            curPath = inBytes.map(e=>String.fromCharCode(e).toString()).join("");
            console.log(curPath)
            break;
        default:
            console.warn("No valid function was provided to the FS api.")
            break;
    }


    inBytes = [];
}
function Reset(){
    inBytes = [];
}
module.exports = new moduleClass(0, Write, Read, Call, Reset)