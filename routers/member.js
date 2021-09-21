const express = require('express');
const router = express();
const MemberControllers = require('../controllers/member');
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
const authMana = require('../middlleware/authManager');
router.get('/Member/one/:id', MemberControllers.getOne);
router.get('/Member', MemberControllers.getAll);
router.post('/Member/searchEmail',MemberControllers.searchEmail);
router.post('/Member/checkOTP',MemberControllers.checkOTP);
router.post('/Member/changePass',MemberControllers.changePass);
router.post(
  '/Member/create',
  upload.single('avatar'),
  MemberControllers.create
);
router.post('/manager/Member/create', authMana, MemberControllers.create);
router.post('/Member/resetPassword/:id', MemberControllers.resetPassword);
router.put('/Member/update/:id', MemberControllers.update);
router.post('/Member/login', MemberControllers.login);
router.post('/Member/add/resuilt/:id', MemberControllers.resuilt);
router.post('/Member/logout', MemberControllers.logout);
router.post('/Member/logoutall', MemberControllers.logoutall);
router.delete('/delete/member/:id', MemberControllers.deleteOne);
router.post('/Member/deleteMany', authMana, MemberControllers.deleteMany);
module.exports = router;
