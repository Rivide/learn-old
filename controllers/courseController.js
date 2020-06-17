const Course = require('../models/course');
const Article = require('../models/article');
const { check } = require('express-validator');
const debug = require('debug')('learn:server:courseController');
const controller = require('./generic/genericController');
const async = require('async');

const args = {
    validators: [
        check('title', 'Course title required').trim().isLength({ min: 1 }),
        check('title').escape()
    ]
};

const list = new controller.List(Course);
const detail = new controller.Detail(Course);
detail.getMiddleware = function(req, res, next) {
    Course.findById(req.params.id).populate('articles').exec((err, doc) => {
        if (err) {
            return next(err);
        }
        if (doc === null) {
            err = new Error(this.Model.modelName + ' not found');
            err.status = 404;

            return next(err);
        }

        res.render(this.getViewPath(), this.getContext(doc));
    });
};
const create = new controller.Create(Course, args);
create.getFields = function(req) {
    const fields = {};
    const articleFields = [];
    for (const [key, value] of Object.entries(req.body)) {
        const match = key.match(/([a-zA-Z]+)[0-9]+/);
        const fieldName = match[0];
        if (fieldName === 'articleTitle' || fieldName === 'articleBody') {
            const index = parseInt(match[1]);
            if (!articleFields[index]) {
                articleFields[index] = {};
            }
            if (fieldName === 'articleTitle') {
                articleFields[index].title = value;
            }
            else {
                articleFields[index].body = value;
            }
        }
    }
    const articles = articleFields.map(fieldSet => {
        const article = new Article(fieldSet);
        Article.findOne({ title: fieldSet.title }).exec((err, existingArticle) => {
            if (err) {
                return next(err);
            }

            if (existingArticle) {
                res.redirect(existingArticle.url);
            }
            else {
                this.saveDoc(doc, res, next);
            }
        });
    })
}
const update = new controller.Update(Course, args);
const del = new controller.Delete(Course);

exports.list = list.get('title');
exports.detail = detail.get();
exports.createGet = create.get();
exports.createPost = create.post();
exports.updateGet = update.get();
exports.updatePost = update.post();
exports.deleteGet = del.get();
exports.deletePost = del.post();
