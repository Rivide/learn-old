const Course = require('../models/course');
const Article = require('../models/article');
const Node = require('../models/node');
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
    // populateNodes(course, nodes, fields = { path: 'nodes', populate: { path: 'next article' } }, lastPopulate = fields.populate) {
    //     /*fields = {
    //         path: 'nodes',
    //         populate: {
    //             path: 'next article',
    //             populate: {
    //                 path: 'next article'
    //             }
    //         }
    //     }*/
        
    //     return new Promise((resolve, reject) => {
    //         course.populate(fields).then(popCourse => {
    //             nodes = nodes || popCourse.nodes;
    //             const nextNodes = nodes.reduce((next, node) => next.concat(node.next), []);

    //             if (nextNodes.length) {
    //                 lastPopulate.populate = Object.assign({}, lastPopulate);
    //                 this.populateNodes(course, nextNodes, fields, lastPopulate.populate).then(finalCourse => resolve(finalCourse));
    //             }
    //             else {
    //                 resolve(popCourse);
    //             }
    //         });
    //     });
    // }
    getMiddleware(req, res, next) {
        async.parallel({
            course: callback => {
                Course.findById(req.params.id).populate({
                    path: 'nodes',
                    populate: {
                        path: 'article next'
                    }
                }).exec(callback);
            },
            articles: callback => {
                Article.find({}, callback);
            }
        }, (err, results) => {
            if (err) {
                return next(err);
            }
            res.render(this.getViewPath(), { ...this.getContext(), ...results });
        });
    }
    // saveNodes(nodes, next, nodeDict) {
    //     return nodes.map(node => {
    //         console.log(node);
    //         console.log(node.next[0]);
    //         console.log(node === node.next[0]);
    //         if (node.next.length) {
    //             //console.log('t1');
    //             node.next = this.saveNodes(node.next, next);
    //             //console.l
    //         }

    //         node.article = node.article._id;

    //         const doc = new Node(node);

    //         if (node._id) {
    //             doc.isNew = false;
    //         }

    //         doc.save(err => {
    //             if (err) {
    //                 return next(err);
    //             }
    //         });

    //         return doc._id;
    //     });
    // }
    postMiddleware(req, res, next) {
        let nodes = JSON.parse(req.body.nodes);

        async.parallel(nodes.filter(node => !node._id).map(node => callback => {
            const nodeDoc = new Node();
            nodeDoc.save({ validateBeforeSave: false }, callback)
            node._id = nodeDoc._id;
            debug("NODE ID UPDATED");
            debug(node._id);
        }), err => {
            debug("Nodes inserted.");
            if (err) {
                return next(err);
            }

            async.parallel(nodes.map(node => callback => {
                Node.findById(node._id, (err, existingDoc) => {
                    if (err) {
                        return callback(err, existingDoc);
                    }
                    debug("NODE: ");
                    debug(node);
                    existingDoc.x = node.x;
                    existingDoc.y = node.y;
                    existingDoc.article = node.article._id;
                    existingDoc.next = node.next.map(nextNodeKey => nodes.find(foundNode => foundNode.key == nextNodeKey)._id);

                    existingDoc.save(callback);
                });
            }), (err, savedNodes) => {
                debug("Nodes saved.");

                if (err) {
                    return next(err);
                }
                req.body.nodes = savedNodes.map(node => node._id);
                debug(req.body.nodes);
                super.postMiddleware(req, res, next);
            });
        });
    }
    getViewPath() {
        return 'course/courseUpdate';
    }
}
class CourseDetail extends controller.Detail {
    getMiddleware(req, res, next) {
        Course.findById(req.params.id).populate({
            path: 'nodes',
            populate: {
                path: 'article next'
            }
        }).exec((err, doc) => {
            if (err) {
                return next(err);
            }
            if (doc === null) {
                err = new Error(this.Model.modelName + ' not found');
                err.status = 404;

                return next(err);
            }

            debug(doc.nodes)

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
