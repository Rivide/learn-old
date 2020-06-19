function getAllPropertyNames(object) {
    const propertyNames = new Set();
    let proto = Object.getPrototypeOf(object);

    do {
        Object.getOwnPropertyNames(proto).forEach(name => {
            if (name !== 'constructor') {
                propertyNames.add(name)
            }
        });
        proto = Object.getPrototypeOf(proto);
    }
    while (proto.constructor.name !== 'Object')

    return Array.from(propertyNames);
}
function bindMethods(object) {
    getAllPropertyNames(object).forEach(name => {
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