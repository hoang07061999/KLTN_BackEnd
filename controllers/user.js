const User= require('../module/user')
const OTPModule= require('../module/otp')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const generator = require('generate-password')
try {
    const UserControler = {                     
        getAll: async (req, res) => {
            const user = await User.find()
            res.json({ user })
        },
        create: async (req, res) => {
            const {email} = req.body
            const validEmail = await User.findOne({email})
            if(validEmail)
            {
                return res.status(400).send({msg: "Email đã tồn tại"})
            }
            const user = new User(req.body)
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
        },
        login: async (req, res) => {
            try {
                const { email, matkhau } = req.body
                const user = await User.findByCredentials(email, matkhau)
                if (!user) {
                    return res.send({ error: "Login faild! Check authentication" })
                }
                const token = await user.generateAuthToken()
                res.send({ user, token })
            }
            catch (erro) {
                return res.status(401).send({ error: "Login faild! Check authentication" });
            }
        },
        logout: async (req, res) => {
            try {
                req.user.tokens = req.user.tokens.filter((token) => {
                    return token.token != req.token;
                })
                await req.user.save();
                res.send();
            } catch (error) {
                res.status(500).send(error);
            }
        },
        logoutall: async (req, res) => {
            try {
                req.user.tokens.splice(0, req.user.tokens.length)
                await req.user.save()
                res.status(200).send({ Error: "Log out Success!!" });
            } catch (error) {
                res.status(500).send(error);
            }
        },
        getOne: async (req, res) => {
            const user = await User.findById({ _id: req.params.id })
            res.send(user)
        },
        deleteOne: async (req, res) => {
            const data = await User.findByIdAndDelete({ _id: req.params.id })
            res.status(200).send({ data })
        },
        deleteMany: async (req, res) => {
            const listUser = req.body.list
            const userDeleted = []
            for (var i = 0; i < listUser.length; i++) {
                const data = await User.findByIdAndDelete({ _id: listUser[i] })
                userDeleted.push(data)
            }
            res.status(200).send(userDeleted)
        },
        update: async (req, res) => {
            const { ho, ten, sdt, ngaysinh, diachi,matkhau,email,oldPass,gioitinh } = req.body;
            const user = await User.findById({ _id: req.params.id })
            user.ho = ho ? ho : user.ho;
            user.ten = ten ? ten : user.ten;
            user.sdt = sdt ? sdt : user.sdt;
            user.ngaysinh = ngaysinh ? ngaysinh : user.ngaysinh;
            user.diachi = diachi ? diachi : user.diachi;
            user.gioitinh = gioitinh ? gioitinh : user.gioitinh;
            user.avatar = req.file ? req.file.path.split('\\').splice(1).join('\\') : user.avatar;
            if(matkhau){
                const checkUser = await User.checkUser(email, oldPass)
                if (!checkUser) {
                    return res.status(201).send({mesenger: 'Wrong Password'}) 
                }
                user.matkhau = matkhau
                await user.save();
                return res.json({pass:true,user})
            } 
            await user.save();
            res.json(user)
        },
        resetPassword: async (req,res) =>{
            const user = await User.findById({ _id: req.params.id })
            user.matkhau = '12345678';
            await user.save();
            res.status(200).send({mesenger: 'Success'})
        },
        forgetPassword: async (req,res) =>{
            const {email} = req.body
            const user = await User.findOne({email})
            if(!user)
            {
                return res.status(400).send({mesenger: `Dont exist User with email: ${email}`})
            }
            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: "NPTPEducation@gmail.com",
                  pass: "HoanG26051999"
                }
              });
            var createOTP = generator.generate({
                length: 4,
                numbers: true
            });
            const output = `
            <h2> Mã xác thực của bạn là :</h2>
            <h1>${createOTP}</h1>
            <p><b>NOTE: </b> Mã xác thực sẽ hết hạn sau 3 phút. </p>
            `;
            const OTPValid = await OTPModule.findOne({email})
            if(!OTPValid)
            {
                const opt = new OTPModule({email,OTP:createOTP})
                await opt.save();
            } else {
                const otp = await OTPModule.findById({_id: OTPValid.id})
                otp.OTP = createOTP
                await otp.save()
            }
            let info = await transporter.sendMail({
                from: '"TPEducation" <NPTPEducation@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Đặt lại mật khẩu", // Subject line
                text: "Mã xác thực.", // plain text body
                html: output // html body
              });
            res.status(200).send({correct: true,mesenger: 'Success'})
        },
        OTPChecked: async (req,res) =>{
            const {email,OTP} = req.body;
            const checkOTP = await OTPModule.findOne({email})
            if(checkOTP){
                if(OTP === checkOTP.OTP)
                {
                    const user = await User.findOne({email})
                    await OTPModule.deleteOne({email})
                    return res.status(200).send({
                        allow: true,
                        _id: user._id
                    })
                }
                res.status(400).send({allow: false,erro: "Something wrong !!!!"})
            }
        },
        resetForgetPassword: async (req,res) =>{
            const { id,password } = req.body;
            const user = await User.findById({_id: id})
            if(user){
                user.matkhau = password
                user.save();
                res.status(200).send({ Success: true})
            }
        }
    }
    module.exports = UserControler;
} catch (error) {
    // res.sdt(400).send(error)
}