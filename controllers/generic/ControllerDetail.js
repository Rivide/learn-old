const ControllerFunction = require('./ControllerFunction');
const toCamelCase = require('./toCamelCase');
const encode = require('../encode');

module.exports = class ControllerDetail extends ControllerFunction {
    getContext(doc) {
        const context = {};
                
        context.title = this.Model.modelName;
        context[toCamelCase(this.Model.modelName)] = doc;
        context.encode = encode;

        return context;
    }
    getViewPath() {
        const camelCase = toCamelCase(this.Model.modelName);
        return camelCase + '/' + camelCase + 'Detail';
    }
    getMiddleware(req, res, next) {
        this.Model.findById(req.params.id,
            (err, doc) => {
                if (err) {
                    return next(err);
                }
                if (doc === null) {
                    err = new Error(this.Model.modelName + ' not found');
                    err.status = 404;
    
                    return next(err);
                }

                res.render(this.getViewPath(), this.getContext(doc));
            }
        );
    }
    get(fields) {
        return this.getMiddleware;
    }
}