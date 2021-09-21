const express = require('express');
const TestControler = require('../controllers/test');
const router = express();
const TestControllers = require('../controllers/test');

router.get('/test',TestControllers.getAll);

router.get('/test/:id',TestControllers.getOne);

router.post('/create/test/:id',TestControllers.create);

router.post('/add/question/:idtest',TestControllers.addQuestion); ////

router.delete('/delete/test/:id', TestControllers.delete)

router.put('/update/test/:preId', TestControllers.update)

module.exports = router;

