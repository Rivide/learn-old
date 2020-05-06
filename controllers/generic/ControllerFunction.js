function bindMethods(object) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(object))
        .forEach(name => {
            if (name !== 'constructor') {
                object[name] = object[name].bind(object);
            }
        });
}
module.exports = class ControllerFunction {
    constructor(Model) {
        this.Model = Model;
        bindMethods(this);
    }
}