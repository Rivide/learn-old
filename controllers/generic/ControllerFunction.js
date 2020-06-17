function bindMethods(object) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(object))
        .forEach(name => {
            if (name !== 'constructor') {
                object[name] = object[name].bind(object);
            }
        });
}
module.exports = class ControllerFunction {
    constructor(Model, args) {
        this.Model = Model;
        this.args = args;
        bindMethods(this);
    }
}