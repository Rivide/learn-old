const ControllerFunction = require('./ControllerFunction');
const { validationResult } = require('express-validator');
const toCamelCase = require('./toCamelCase');
const debug = require('debug')('learn:server:ControllerCreate')

module.exports = class ControllerCreate extends ControllerFunction {
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
        doc.save(function (err) {
            if (err) {
                return next(err);
            }

            res.redirect(doc.url);
        });
    }
    validatedSaveDoc(doc, searchFields, res, next) {
        this.Model.findOne(searchFields).exec((err, existingDoc) => {
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
    /*extractFields(reqBody) {
        const fields = {
            single: [],
            list: []
        };
        for (let [key, value] in Object.entries(this.Model.schema)) {
            let fieldValue;
            if (Array.isArray(value)) {
                fields.list.push()
            }
            else {
                fieldValue = value;
            }
            
        }
    }*/
    getFields(req) {
        // used to create the doc
        return req.body;
    }
    getSearchFields(req) {
        // used to search for duplicate docs
        return req.body;
    }
    getMiddleware(req, res, next) {
        res.render(this.getViewPath(), this.getContext());
    }
    postMiddleware(req, res, next) {
        console.log(this);
        const errors = validationResult(req);

        const doc = this.createDoc(this.getFields(req));

        if (!errors.isEmpty()) {
            res.render(this.getViewPath(), this.getContext(doc, errors));
        }
        else {
            this.validatedSaveDoc(doc, this.getSearchFields(req), res, next);
        }
    }
    get() {
        return this.getMiddleware;
    }
    post() {
        if (this.args.validators) {
            return this.args.validators.concat([this.postMiddleware]);
        }
        return this.postMiddleware;
    }
}