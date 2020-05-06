const express = require('express');
const router = express.Router();

const learnController = require('../controllers/learnController');
const articleController = require('../controllers/articleController');
const courseController = require('../controllers/courseController');

router.get('/', learnController.index);
router.get('/articles', articleController.list);
router.get('/article/create', articleController.createGet);
router.post('/article/create', articleController.createPost);
router.get('/article/:id/update', articleController.updateGet);
router.post('/article/:id/update', articleController.updatePost);
router.get('/article/:id/delete', articleController.deleteGet);
router.post('/article/:id/delete', articleController.deletePost);
router.get('/article/:id', articleController.detail);

router.get('/courses', courseController.list);
router.get('/course/create', courseController.createGet);
router.post('/course/create', courseController.createPost);
router.get('/course/:id', courseController.detail);
router.get('/course/:id/update', courseController.updateGet);
router.post('/course/:id/update', courseController.updatePost);
router.get('/course/:id/delete', courseController.deleteGet);
router.post('/course/:id/delete', courseController.deletePost);

module.exports = router;
