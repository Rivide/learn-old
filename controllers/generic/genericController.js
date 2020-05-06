const { validationResult } = require('express-validator');
const debug = require('debug')('learn:server:genericController');
const toCamelCase = require('./toCamelCase');

const controllerFunctions = {
    List: require('./ControllerList'),
    Detail: require('./ControllerDetail'),
    Create: require('./ControllerCreate'),
    Update: require('./ControllerUpdate'),
    Delete: require('./ControllerDelete')
}
module.exports = {
    ...controllerFunctions/*,
    getAll(Model) {
        const all = {};
        Object.keys(controllerFunctions)
            .forEach(key => all[toCamelCase(key)] = new controllerFunctions[key](Model));
        return all;
    }*/
};