const ControllerFunction = require('./ControllerFunction');
const toCamelCase = require('./toCamelCase');

module.exports = class ControllerList extends ControllerFunction {
    getContext(list) {
        const context = {};

        context.title = this.Model.modelName + ' List';
        context[toCamelCase(this.Model.modelName) + 'List'] = list;

        return context;
    }
    getViewPath() {
        const camelCase = toCamelCase(this.Model.modelName);
        return camelCase + '/' + camelCase + 'List';
    }
    getMiddleware(fields, req, res, next) {
        this.Model.find({}, fields || '')
        .exec((err, list) => {
            if (err) {
                return next(err);
            }
            
            res.render(this.getViewPath(), this.getContext(list));
        });
    }
    get(fields) {
        return this.getMiddleware.bind(this, fields);
    }
}