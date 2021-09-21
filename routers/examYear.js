const express = require('express');
const ExamControllers = require('../controllers/examYear');
const router = express();

router.get('/examYear',ExamControllers.getAll);

router.get('/examyear/one/:id',ExamControllers.getOne);

router.post('/create/ExamYear/:id',ExamControllers.create)

router.delete('/delete/ExamYear/:id', ExamControllers.delete);

router.put('/update/ExamYear/:id', ExamControllers.update)

module.exports = router;