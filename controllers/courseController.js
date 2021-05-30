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
    /*getFields(req) {
        const fields = super.getFields(req);
        async.parallel(fields.articles.map(article => callback => ))
    }*/
}
class CourseUpdate extends controller.Update {
    /*populateNodes(nodes) {
        //console.log(nodes);
        nodes.populate('article next').then(nodes => console.log(nodes));

        /*nodes.forEach(node => {
            this.populateNodes(node.next);
        });*/
    //}
    populateNodes(course, nodes, fields = { path: 'nodes', populate: { path: 'next article' } }, lastPopulate = fields.populate) {
        /*fields = {
            path: 'nodes',
            populate: {
                path: 'next article',
                populate: {
                    path: 'next article'
                }
            }
        }*/
        
        return new Promise((resolve, reject) => {
            course.populate(fields).then(popCourse => {
                nodes = nodes || popCourse.nodes;
                const nextNodes = nodes.reduce((next, node) => next.concat(node.next), []);

                if (nextNodes.length) {
                    lastPopulate.populate = Object.assign({}, lastPopulate);
                    this.populateNodes(course, nextNodes, fields, lastPopulate.populate).then(finalCourse => resolve(finalCourse));
                }
                else {
                    resolve(popCourse);
                }
            });
        });
    }
    getMiddleware(req, res, next) {
        async.parallel({
            course: callback => {
                /*const course = */Course.findById(req.params.id).populate({
                    path: 'nodes',
                    populate: {
                        path: 'article next'
                    }
                }).exec(callback);

                //this.populateNodes(course).then(popCourse => course.exec(callback));
            },
            articles: callback => {
                Article.find({}, callback);
            }
        }, (err, results) => {
            if (err) {
                return next(err);
            }
            //console.log(results.course.nodes);
            //console.log(results.course);
            res.render(this.getViewPath(), { ...this.getContext(), ...results });
            //console.log(results.articles[0]);
        });
    }
    saveNodes(nodes, next, nodeDict) {
        return nodes.map(node => {
            console.log(node);
            console.log(node.next[0]);
            console.log(node === node.next[0]);
            if (node.next.length) {
                //console.log('t1');
                node.next = this.saveNodes(node.next, next);
                //console.l
            }

            node.article = node.article._id;

            const doc = new Node(node);

            if (node._id) {
                doc.isNew = false;
            }

            doc.save(err => {
                if (err) {
                    return next(err);
                }
            });

            return doc._id;
        });
    }
    postMiddleware(req, res, next) {
        let nodes = JSON.parse(req.body.nodes);
        //console.log(nodes[0].next[0].article);

        //req.body.nodes = this.saveNodes(nodes, next);
        req.body.nodes = nodes.map(node => {
            // add comment
            node.article = node.article._id;

            const doc = new Node(node);
            
            if (node._id) {
                // ensure update instead of insert
                doc.isNew = false;
            }
            else {
                console.log(doc._id);
            }

            doc.save(err => {
                if (err) {
                    return next(err);
                }
            });

            return doc._id;
        });

        return super.postMiddleware(req, res, next);
        //nodes.forEach(node => console.log(node));
        /*req.body.nodes = nodes.map(node => {
            //console.log(node);
            node.article = node.article._id;
            const nodeDoc = new Node(node);
            if (node._id) {
                nodeDoc.isNew = false;
            }
            nodeDoc.save(err => {
                if (err) {
                    return next(err);
                }
            });
            console.log(nodeDoc);
            return nodeDoc._id;
        });

        return super.postMiddleware(req, res, next);*/
    }
    getViewPath() {
        return 'course/courseUpdate';
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
