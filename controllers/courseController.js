const Course = require('../models/course');
const Article = require('../models/article');
const { check } = require('express-validator');
const debug = require('debug')('learn:server:courseController');
const controller = require('./generic/genericController');
const async = require('async');

class CourseCreate extends controller.Create {
    getMiddleware(req, res, next) {
        Article.find({}, (err, articles) => {
            if (err) {
                return next(err);
            }
            res.render(this.getViewPath(), { ...this.getContext(), articles });
        });
    }
}
class CourseUpdate extends controller.Update {
    getMiddleware(req, res, next) {
        async.parallel({
            course: function (callback) {
                Course.findById(req.params.id, callback);
            },
            articles: function (callback) {
                Article.find({}, callback);
            }
        }, (err, results) => {
            if (err) {
                return next(err);
            }
            res.render(this.getViewPath(), { ...this.getContext(), ...results });
        })
    }
}
class CourseDetail extends controller.Detail {
    getMiddleware(req, res, next) {
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
    }
}
const args = {
    validators: [
        check('title', 'Course title required').trim().isLength({ min: 1 }),
        check('title').escape()
    ]
};

const list = new controller.List(Course);
const detail = new CourseDetail(Course);
const create = new CourseCreate(Course, args);
const update = new CourseUpdate(Course, args);
const del = new controller.Delete(Course);

exports.list = list.get('title');
exports.detail = detail.get();
exports.createGet = create.get();
exports.createPost = create.post();
exports.updateGet = update.get();
exports.updatePost = update.post();
exports.deleteGet = del.get();
exports.deletePost = del.post();
