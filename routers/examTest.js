const express = require('express');
const router = express();
const examTestControllers = require('../controllers/examTest');

router.get('/examTest',examTestControllers.getAll);

router.post('/create/examTest/:id',examTestControllers.create);

router.get('/examTest/one/:id',examTestControllers.getOne);

router.post('/examTest/question/:idexamTest',examTestControllers.addQuestion);

router.delete('/delete/examTest/:id', examTestControllers.delete)

router.put('/update/examTest/:id', examTestControllers.update)

module.exports = router;

