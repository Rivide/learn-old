const ControllerCreate = require('./ControllerCreate');
const { validationResult } = require('express-validator');
const toCamelCase = require('./toCamelCase');
const debug = require('debug')('learn:server:ControllerUpdate')


module.exports = class ControllerUpdate extends ControllerCreate {
    getID(req) {
        return req.params.id;
    }
    getContext(doc, errors) {
        const context = super.getContext(doc, errors);
        context.title = 'Update ' + this.Model.modelName;
        return context;
    }
    getFields(req) {
        // used to create the doc
        return {_id: this.getID(req), ...req.body};
    }
    getMiddleware(req, res, next) {
        this.Model.findById(this.getID(req), (err, doc) => {
            if (err) {
                return next(err);
            }
            if (doc === null) {
                let err = new Error(this.Model.modelName + ' not found');
                err.status = 404;
                return next(err);
            }
            res.render(this.getViewPath(), this.getContext(doc));
        });
    }
    saveDoc(doc, res, next, id) {
        this.Model.findByIdAndUpdate(id, doc, function(err, newDoc) {
            if (err) {
                return next(err);
            }
            res.redirect(newDoc.url);
        });
    }
    validatedSaveDoc(doc, res, next, id) {
        this.saveDoc(doc, res, next, id);
    }
    postMiddleware(req, res, next) {
        const errors = validationResult(req);

        /*const doc = this.createDoc({
            _id: this.getID(req),
            ...req.body
        });*/
        const doc = this.createDoc(this.getFields(req));
        
        if (!errors.isEmpty()) {
            res.render(this.getViewPath(), this.getContext(doc, errors));
        }
        else {
            this.validatedSaveDoc(doc, res, next, this.getID(req));
        }
    }
}