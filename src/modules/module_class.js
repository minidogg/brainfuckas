module.exports = class ModuleClass{
    /**
     * 
     * @param {number} id 
     * @param {*} writeByteFunc 
     * @param {*} readByteFunc 
     * @param {*} callFunc 
     * @param {*} resetFunc 
     */
    constructor(id, writeByteFunc, readByteFunc, callFunc, resetFunc ) {
        this.id = id;
        this.Write = writeByteFunc;
        this.Read = readByteFunc;
        this.Call = callFunc;
        this.Reset = resetFunc;
    }
}