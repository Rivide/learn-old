const Course = require('../models/course');
const { check } = require('express-validator');
const debug = require('debug')('learn:server:courseController');
const controller = require('./generic/genericController');

const list = new controller.List(Course);
const detail = new controller.Detail(Course);
const create = new controller.Create(Course);
const update = new controller.Update(Course);
const del = new controller.Delete(Course);

exports.list = list.get('title');
exports.detail = detail.get();
exports.createGet = create.get();
exports.createPost = create.post([
    check('title', 'Course title required').trim().isLength({ min: 1 }),
    check('title').escape()
]);
exports.updateGet = update.get();
exports.updatePost = update.post([
    check('title', 'Course title required').trim().isLength({ min: 1 }),
    check('title').escape()
]);
exports.deleteGet = del.get();
exports.deletePost = del.post();
