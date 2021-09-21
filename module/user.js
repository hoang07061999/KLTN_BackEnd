const mongoose = require("mongoose")
const validator = require("validator") // check dieu kien
const bcrypt = require("bcrypt")        // ma hoa mk
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    ho: {
        type: String,
    },
    ten: {
        type: String,
    },
    sdt: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: "Invalid Email address" })
            }
        }
    },
    diachi: {
        type: String,
        required: true,
    },
    gioitinh: {
        type: String,
        required: true,
        trim: true
    },
    ngaysinh: {
        type: Date,
        required: true,
        trim: true
    },
    matkhau: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    accountType:{
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

},
    { versionKey: false }
)
UserSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("matkhau")) {
        user.matkhau = await bcrypt.hash(user.matkhau, 10)
    }
    next()
})

UserSchema.methods.generateAuthToken = async function () { //ham xac thuc
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JMT_KEY, { expiresIn: 3000 })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.statics.findByCredentials = async  (email,matkhau) => {  // ham dang nhap
    const user = await User.findOne({ email })            //so sanh voi cai email
    if (!user) {                                            //neeus khong co email
        throw new Error(JSON.stringify({ error: ["Invalid Login Creedentials"] })) //xuat ra thog bao loi
    }
    const isPassWordMath = await bcrypt.compare(matkhau, user.matkhau)  //chay ham so sanh mk
    if (!isPassWordMath) {
        throw new Error(JSON.stringify({ error: ["Invalid Login Creedentials"] })) //xuat ra thog bao loi
    }
    return user
}

UserSchema.statics.checkUser = async  (email,matkhau) => {  // ham dang nhap
    const user = await User.findOne({ email })            //so sanh voi cai email
    if (user) {                                            //neeus khong co email
        const isPassWordMath = await bcrypt.compare(matkhau, user.matkhau)  //chay ham so sanh mk
        if (isPassWordMath) {
            return user
        }
    }
    return null
}


const User = mongoose.model("User", UserSchema, "User");
module.exports = User;