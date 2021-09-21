const express = require('express');
const router = express();var multer = require('multer')
const RTRSControllers = require('../controllers/rating&resuilt');

router.get('/RTRS',RTRSControllers.getAll);

// router.get('/topic/:id',TopicControllers.getOne);

// router.post('/create/RTRS',RTRSControllers.create);

router.delete('/delete/RTRS/:id', RTRSControllers.delete);

// router.put('/update/topic/:id',upload.single('avatar'),TopicControllers.update)

module.exports = router;