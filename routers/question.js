const express = require('express');
const router = express();
const QuestionControllers = require('../controllers/question');

router.get('/question',QuestionControllers.getAll);

router.get('/question/:id',QuestionControllers.getOne);

router.post('/create/question/:idTopic',QuestionControllers.create);

router.delete('/delete/question/:id', QuestionControllers.delete)

router.put('/update/question/:id', QuestionControllers.update)
module.exports = router;