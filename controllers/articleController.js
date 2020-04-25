const Article = require('../models/article');
const { check, validationResult } = require('express-validator');
const async = require('async');
const encode = require('./encode');

exports.list = function(req, res, next) {
    Article.find({}, 'title body')
    .populate('author')
    .exec(function (err, article_list) {
        if (err) {
            return next(err);
        }
        
        res.render('article_list', { title: 'Article List', article_list: article_list})
    })
};

exports.detail = function(req, res, next) {
    const article = Article.findById(req.params.id,
        function(err, article) {
            if (err) {
                return next(err);
            }
            if (article === null) {
                err = new Error('Article not found');
                err.status = 404;

                return next(err);
            }
            res.render('article_detail',
                { title: 'Article', article: article, encode: encode });
        }
    );
};

exports.createGet = function(req, res) {
    res.render('article_form', { title: 'Create Article' });
};

exports.createPost = [
    check('title', 'Article title required').trim().isLength({ min: 1 }),
    check('title').escape(),
    check('body', 'Article body required').trim().isLength({ min: 1 }),

    (req, res, next) => {
        const errors = validationResult(req);

        const article = new Article({
            title: req.body.title,
            body: req.body.body
        });

        if (!errors.isEmpty()) {
            res.render('article_form', { title: 'Create Article', article: article, errors: errors.array() });
        }
        else {
            Article.findOne({ 'title': req.body.title }).exec(function(err, existingArticle) {
                if (err) {
                    return next(err);
                }

                if (existingArticle) {
                    res.redirect(existingArticle.url);
                }
                else {
                    article.save(function(err) {
                        if (err) {
                            return next(err);
                        }
                        
                        res.redirect(article.url);
                    });

                }
            })
        }
    }
]

exports.updateGet = function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (err) {
            return next(err);
        }
        if (article === null) {
            let err = new Error('Article not found');
            err.status = 404;
            return next(err);
        }

        res.render('article_form', { title: 'Update Article', article: article });
    })
};

exports.updatePost = [
    check('title', 'Article title required').trim().isLength({ min: 1 }),
    check('title').escape(),
    check('body', 'Article body required').trim().isLength({ min: 1 }),

    (req, res, next) => {
        const errors = validationResult(req);

        let article = new Article({
            _id: req.params.id,
            title: req.body.title,
            body: req.body.body
        });

        if (!errors.isEmpty()) {
            res.render('article_form', { title: 'Update Article', article: article, errors: errors.array() });
        }
        else {
            Article.findByIdAndUpdate(req.params.id, article, function(err, newArticle) {
                if (err) {
                    return next(err);
                }
                res.redirect(newArticle.url);
            });
        }
    }
];

exports.deleteGet = function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (err) {
            return next(err);
        }
        if (article === null) {
            res.redirect('/learn/article/list');
        }

        res.render('article_delete', { title: 'Delete Article', article: article });
    });
};

exports.deletePost = function(req, res) {
    Article.findByIdAndRemove(req.body.id, function(err) {
        if (err) {
            return next(err);
        }

        res.redirect('/learn/article/list')
    });
};