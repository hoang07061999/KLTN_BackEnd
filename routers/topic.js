const express = require('express');
const router = express();var multer = require('multer')
var upload = multer({ dest: 'public/uploads/' })
const TopicControllers = require('../controllers/topic');

router.get('/topic',TopicControllers.getAll);

router.get('/topic/:id',TopicControllers.getOne);

router.post('/create/topic',upload.single('avatar'),TopicControllers.create);

router.delete('/delete/topic/:id', TopicControllers.delete);

router.put('/update/topic/:id',upload.single('avatar'),TopicControllers.update)

module.exports = router;