const Member = require('../module/member');
const RTRS = require('../module/rating&resuilt');
const nodemailer = require("nodemailer");
const generator = require('generate-password')
const OTPModule= require('../module/otp')
var findID = (data, id) => {
    var resuilt = -1;
    data.forEach((data, index) => {
        if (data._idTest === id) {
            resuilt = index;
        }
    });
    return resuilt;
};

try {
    const MemberControler = {
        getAll: async (req, res) => {
            const member = await Member.find();
            res.json({member});
        },
        getOne: async (req, res) => {
            const member = await Member.findById({_id: req.params.id});
            res.send(member);
        },
        create: async (req, res) => {
            try {
                const member = new Member(req.body);
                if (req.file) {
                    member.avatar = req.file.path.split('\\').splice(1).join('\\');
                }
                await member.save();
                const token = await member.generateAuthToken();
                res.status(201).send({member, token});
            } catch {
                res.status(204).send(
                    {error: 'valid Email'}
                );
            }},
        login : async (req, res) => { // try {
            const {email, matkhau} = req.body;
            const member = await Member.findByCredentials(email, matkhau);
            if (member == 'Email inValid') {
                return res.status(204).send({error: 'Email inValid'});
            }
            if (member == 'Password inCorrect') {
                return res.status(206).send({error: 'Password inCorrect'});
            }
            if (! member) {
                return res.send({error: 'Login faild! Check authentication'});
            }
            const token = await member.generateAuthToken();
            res.send({member, token});
            // }
            // catch (error) {
            //     return res.status(401).send(error);
            // }
        },
        logout : async (req, res) => {
            try {
                req.member.tokens = req.member.tokens.filter((token) => {
                    return token.token != req.token;
                });
                await req.member.save();
                res.send();
            } catch (error) {
                res.status(500).send(error);
            }
        },
        logoutall : async (req, res) => {
            try {
                req.member.tokens.splice(0, req.member.tokens.length);
                await req.member.save();
                res.status(200).send({Messenger: 'Log out Success!!'});
            } catch (error) {
                res.status(500).send(error);
            }
        },

        deleteOne : async (req, res) => {
            const data = await Member.findByIdAndDelete({_id: req.params.id});
            res.status(200).send({data});
        },
        deleteMany : async (req, res) => {
            const listMember = req.body.list;
            const memberDeleted = [];
            for (var i = 0; i < listMember.length; i++) {
                const data = await Member.findByIdAndDelete({_id: listMember[i]});
                memberDeleted.push(data);
            }
            res.status(200).send(memberDeleted);
        },
        update : async (req, res) => {
            const {matkhau, ho, ten} = req.body;
            const member = await Member.findById({_id: req.params.id});
            member.ho = ho ? ho : member.ho;
            member.ten = ten ? ten : member.ten;
            if (matkhau) {
                member.matkhau = matkhau;
            }
            await member.save();
            res.json(member);
        },
        resetPassword : async (req, res) => {
            const member = await Member.findById({_id: req.params.id});
            member.matkhau = '12345678';
            await member.save();
            res.status(200).send({mesenger: 'Success'});
        },
        resuilt : async (req, res) => {
            const member = await Member.findById({_id: req.params.id});
            if (member.resuilt.length > 0) {
                var index = -1;
                index = findID(member.resuilt, req.body._idTest);
                if (index !== -1) {
                    member.resuilt.splice(index, 1);
                    const rtrsOld = await RTRS.findOne({_idTest: req.body._idTest,maker: member.email});
                    if (! rtrsOld) {
                        const rtrs = new RTRS({
                            _idTest: req.body._idTest,
                            maker: member.email,
                            isComplete: req.body.isComplete,
                            isCorrect: req.body.isCorrect,
                            point: req.body.point,
                            nameTest: req.body.nameTest,
                            star: req.body.star,
                            time: req.body.time,
                            percentComplete: req.body.percentComplete
                        });
                        rtrs.maker = member.email;
                        await rtrs.save();
                    } else {
                        (rtrsOld._idTest = req.body._idTest),
                        (rtrsOld.maker = member.email),
                        (rtrsOld.isComplete = req.body.isComplete),
                        (rtrsOld.isCorrect = req.body.isCorrect),
                        (rtrsOld.point = req.body.point),
                        (rtrsOld.nameTest = req.body.nameTest),
                        (rtrsOld.star = req.body.star),
                        (rtrsOld.time = req.body.time),
                        (rtrsOld.percentComplete = req.body.percentComplete),
                        (rtrsOld.createAt = Date.now());
                        await rtrsOld.save();
                        member.resuilt.push(rtrsOld);
                    }
                } else {
                    const rtrs = new RTRS({
                        _idTest: req.body._idTest,
                        isComplete: req.body.isComplete,
                        isCorrect: req.body.isCorrect,
                        point: req.body.point,
                        nameTest: req.body.nameTest,
                        star: req.body.star,
                        time: req.body.time,
                        percentComplete: req.body.percentComplete
                    });
                    rtrs.maker = member.email;
                    await rtrs.save();
                    member.resuilt.push(rtrs);
                }
            } else {
                const rtrs = new RTRS({
                    _idTest: req.body._idTest,
                    isComplete: req.body.isComplete,
                    isCorrect: req.body.isCorrect,
                    point: req.body.point,
                    nameTest: req.body.nameTest,
                    star: req.body.star,
                    time: req.body.time,
                    percentComplete: req.body.percentComplete
                });
                rtrs.maker = member.email;
                await rtrs.save();
                member.resuilt.push(rtrs);
            }
            await member.save();
            res.status(201).send(member.resuilt);
        },
        searchEmail: async (req,res) =>{
            const {email} = req.body
            const member = await Member.findOne({email})
            if(!member)
            {
                return res.status(400).send({msg: `Không tìm thấy email của bạn`})
            }
            if(member.accountType === 'Google')
            {
                return res.status(400).send({msg: `Tính năng chỉ áp dụng cho tài khoản đăng kí trực tiếp`})
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
            res.status(200).send({correct: true,msg: 'Mã xác thực đã được gửi đến Email của bạn'})
        },
        checkOTP: async (req,res) =>{
            const {email,OTP} = req.body;
            const checkOTP = await OTPModule.findOne({email})
            if(checkOTP){
                if(OTP === checkOTP.OTP)
                {
                    const member = await Member.findOne({email})
                    await OTPModule.deleteOne({email})
                    return res.status(200).send({
                        allow: true,
                        _id: member._id
                    })
                }
                res.status(400).send({allow: false,msg: "Something wrong !!!!"})
            }
        },
        changePass: async (req,res) =>{
            const { id,password } = req.body;
            const member = await Member.findById({_id: id})
            if(member){
                member.matkhau = password
                member.save();
                res.status(200).send({ Success: true})
            }
        }
    };
module.exports = MemberControler;} catch (error) {}
