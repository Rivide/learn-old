const ControllerFunction = require('./ControllerFunction');
const { validationResult } = require('express-validator');
const toCamelCase = require('./toCamelCase');

module.exports = class ControllerCreate extends ControllerFunction {
    constructor(Model) {
        super(Model);
    }
    createDoc(fields) {
        return new this.Model(fields);
    }
    getContext(doc, errors) {
        const context = {};

        context.title = 'Create ' + this.Model.modelName;

        if (doc) {
            context[toCamelCase(this.Model.modelName)] = doc;
        }
        if (errors) {
            context.errors = errors.array();
        }

        return context;
    }
    getViewPath() {
        const camelCase = toCamelCase(this.Model.modelName);
        return camelCase + '/' + camelCase + 'Form';
    }
    saveDoc(doc, res, next) {
        doc.save(function(err) {
            if (err) {
                return next(err);
            }
            
            res.redirect(doc.url);
        });
    }
    validatedSaveDoc(doc, fields, res, next) {
        this.Model.findOne(fields).exec((err, existingDoc) => {
            if (err) {
                return next(err);
            }

            if (existingDoc) {
                res.redirect(existingDoc.url);
            }
            else {
                this.saveDoc(doc, res, next);
            }
        });
    }
    getFields(reqBody) {
        
    }
    getMiddleware(req, res, next) {
        res.render(this.getViewPath(), this.getContext());
    }
    postMiddleware(req, res, next) {
        const errors = validationResult(req);

        const doc = this.createDoc(req.body);

        if (!errors.isEmpty()) {
            res.render(this.getViewPath(), this.getContext(doc, errors));
        }
        else {
            this.validatedSaveDoc(doc, req.body, res, next);
        }
    }
    get() {
        return this.getMiddleware;
    }
    post(validators) {
        if (validators) {
            return validators.concat([this.postMiddleware]);
        }
        return this.postMiddleware;
    }
}