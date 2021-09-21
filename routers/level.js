const express = require('express');
const router = express();
const LevelControllers = require('../controllers/level');

router.get('/level',LevelControllers.getAll);

router.get('/level/one/:id',LevelControllers.getOne);

router.post('/create/level',LevelControllers.create)

router.delete('/delete/level/:id', LevelControllers.delete);

router.put('/update/level/:id', LevelControllers.update)

module.exports = router;