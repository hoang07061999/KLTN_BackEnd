const express = require('express');
const router = express();
var multer = require('multer')
var upload = multer({ dest: 'public/uploads/' })
const UserControlers = require('../controllers/user');
// const auth = require('../../middleware/authCustomer')
const authMana = require('../middlleware/authManager');
router.post('/user/login', UserControlers.login);
router.get('/user', UserControlers.getAll);
router.post('/user/create', UserControlers.create);
router.post('/user/forgetPassword', UserControlers.forgetPassword);
router.post('/user/resetPassword/:id', UserControlers.resetPassword);
router.post('/user/OTPChecked', UserControlers.OTPChecked);
router.post('/user/resetForgetPassword', UserControlers.resetForgetPassword);
router.post('/user/:id', UserControlers.getOne);
router.post('/manager/user/create', authMana, UserControlers.create);
router.post('/user/logout', UserControlers.logout);
router.post('/user/logoutall', UserControlers.logoutall);
router.delete('/delete/user/:id', UserControlers.deleteOne);
router.post('/user/deleteMany', authMana, UserControlers.deleteMany);
router.put('/user/update/:id',upload.single('avatar'), UserControlers.update);
router.put('/user/update/admin/:id',UserControlers.update);
module.exports = router;
