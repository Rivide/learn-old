const ControllerFunction = require('./ControllerFunction');
const toCamelCase = require('./toCamelCase');

module.exports = class ControllerDelete extends ControllerFunction {
    getViewPath() {
        const camelCase = toCamelCase(this.Model.modelName);
        return camelCase + '/' + camelCase + 'Delete';
    }
    getContext(doc) {
        const context = {};

        context.title = 'Delete ' + this.Model.modelName;
        context[toCamelCase(this.Model.modelName)] = doc;

        return context;
    }
    getMiddleware(req, res, next) {
        this.Model.findById(req.params.id, (err, doc) => {
            if (err) {
                return next(err);
            }
            if (doc === null) {
                res.redirect('/learn/' + toCamelCase(this.Model.modelName) + 's/');
            }
            res.render(this.getViewPath(), this.getContext(doc));
        });
    }
    postMiddleware(req, res, next) {
        this.Model.findByIdAndRemove(req.body.id, (err) => {
            if (err) {
                return next(err);
            }
    
            res.redirect('/learn/' + toCamelCase(this.Model.modelName) + 's/');
        });
    }
    get() {
        return this.getMiddleware;
    }
    post() {
        return this.postMiddleware;
    }
}