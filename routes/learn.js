const express = require('express');
const router = express.Router();

const learnController = require('../controllers/learnController');
const articleController = require('../controllers/articleController');

router.get('/', learnController.index);
router.get('/article/list', articleController.list);
router.get('/article/create', articleController.createGet);
router.post('/article/create', articleController.createPost);
router.get('/article/:id/update', articleController.updateGet);
router.post('/article/:id/update', articleController.updatePost);
router.get('/article/:id/delete', articleController.deleteGet);
router.post('/article/:id/delete', articleController.deletePost);
router.get('/article/:id', articleController.detail);

module.exports = router;
