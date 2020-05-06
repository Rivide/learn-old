const Article = require('../models/article');
const { check } = require('express-validator');
const debug = require('debug')('learn:server:articleController');
const controller = require('./generic/genericController');

/*exports.list = function(req, res, next) {
    Article.find({}, 'title body')
    .exec(function (err, articleList) {
        if (err) {
            return next(err);
        }
        debug(articleList);
        
        res.render('articleList', { title: 'Article List', articleList: articleList});
    })
};*/
const list = new controller.List(Article);
const detail = new controller.Detail(Article);
const create = new controller.Create(Article);
const update = new controller.Update(Article);
const del = new controller.Delete(Article);

exports.list = list.get('title body');
exports.detail = detail.get();
exports.createGet = create.get();
exports.createPost = create.post([
    check('title', 'Article title required').trim().isLength({ min: 1 }),
    check('title').escape(),
    check('body', 'Article body required').trim().isLength({ min: 1 })
]);
exports.updateGet = update.get();
exports.updatePost = update.post([
    check('title', 'Article title required').trim().isLength({ min: 1 }),
    check('title').escape(),
    check('body', 'Article body required').trim().isLength({ min: 1 })
]);
exports.deleteGet = del.get();
exports.deletePost = del.post();
/*exports.detail = function(req, res, next) {
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
};*/


/*exports.createGet = function(req, res) {
    res.render('articleForm', { title: 'Create Article' });
};*/


/*exports.createPost = [
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
            res.render('articleForm', { title: 'Create Article', article: article, errors: errors.array() });
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
]*/


/*exports.updateGet = function(req, res) {
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
};*/

/*
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
];*/



/*exports.deleteGet = function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (err) {
            return next(err);
        }
        if (article === null) {
            res.redirect('/learn/article/list');
        }

        res.render('article_delete', { title: 'Delete Article', article: article });
    });
};*/

/*exports.deletePost = function(req, res) {
    Article.findByIdAndRemove(req.body.id, function(err) {
        if (err) {
            return next(err);
        }

        res.redirect('/learn/article/list')
    });
};*/