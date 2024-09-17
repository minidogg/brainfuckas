const fs = require("fs")
const path = require("path")

const modulePath = path.resolve("./modules")
let bfModules = {}
fs.readdirSync(modulePath, {recursive: true}).forEach(e=>{
  if(!e.endsWith(".bfas.js"))return;
  console.log("Loading "+e)
  let module = require(path.join(modulePath, e));
  bfModules[module.id] = module;
  console.log("Loaded "+e)
})

class BrainFuckAs{
    constructor(memorySize = 30000){
        this.memory = new Uint8Array(memorySize);
        this.memoryPointer = 0;

        this.curApi = 0;
    }

    run(code, input){
        let result = '';
        let throwErr = (err, i) => {
          return [
            'Error: ' + err + ` (Char:${i}, MemoryLocation:${this.memoryPointer})`,
            {
              memoryPointer: this.memoryPointer,
              memory: this.memory,
            },
          ];
        };
        for (let i = 0; i < code.length; i++) {
          switch (code[i]) {
            case '+':
              this.memory[this.memoryPointer]++;
              break;
            case '-':
              this.memory[this.memoryPointer]--;
              break;
            case '>':
              this.memoryPointer++;
              if (this.memory[this.memoryPointer] == undefined) this.memory.push(0);
              break;
            case '<':
              this.memoryPointer--;
              if (this.memory[this.memoryPointer] == undefined) {
                this.memoryPointer++;
                return throwErr(`Memory location can't go negative!`, i);
              }
              break;
            case '[':
              if (this.memory[this.memoryPointer] == 0) {
                while (true) {
                  if (code.length < i || code[i] == ']') break;
                  i++;
                }
              }
              break;
            case ']':
              if (this.memory[this.memoryPointer] != 0) {
                while (true) {
                  if (code.length < i || code[i] == '[') break;
                  i--;
                }
              }
              break;
            case '.':
              result += String.fromCharCode(this.memory[this.memoryPointer]);
              break;
            case ' ':
              break;
            case ',':
              this.memory[this.memoryPointer] = input.charCodeAt(0);
              break;
            // Set Current API. This will result in the reset of the API also being called.
            case("/"):
              bfModules[this.curApi].Reset()
              this.curApi = this.memory[this.memoryPointer];
              break;

            // Call the API
            case("?"):
              bfModules[this.curApi].Call()
              break;

            // Read Byte from the API
            case(";"):
              this.memory[this.memoryPointer] = bfModules[this.curApi].Read()
              break;

            // Write Byte to the API
            case(":"):
              bfModules[this.curApi].Write(this.memory[this.memoryPointer])
              break;
            default:
              return throwErr(`Invalid command: ${code[i]}`, i);
          }
        }
        return [
          result,
        ];
    }
}

let bf = new BrainFuckAs(100)
bf.run("/:++++++++++++++++++++++++++++++++++++++++++++++++:?")
console.log(bf.memory)