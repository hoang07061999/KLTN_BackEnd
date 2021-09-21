const mongoose = require("mongoose")
const validator = require("validator") // check dieu kien
const bcrypt = require("bcrypt")        // ma hoa mk
const jwt = require("jsonwebtoken")


const MemberSchema = new mongoose.Schema({
    ho: {
        type: String, // bat buoc phai co giong nhu k cho null trong sql
    },
    ten: {
        type: String,
    },
    avatar: {
        type: String,
    },
    image: {
        type: String,
    },
    accountType: {
        type: String,
    },
    resuilt: [],
    email: {
        type: String,
        required: true,
        unique: true, // truong duy nhat khong dk trung
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) { // neu email truyen vaof khong dung 
                throw new Error({ error: "Invalid Email address" })
            }
        }
    },
    matkhau: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
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
MemberSchema.pre("save", async function (next) {
    const member = this
    if (member.isModified("matkhau")) {
        member.matkhau = await bcrypt.hash(member.matkhau, 10)
    }
    next()
})

MemberSchema.methods.generateAuthToken = async function () { //ham xac thuc
    const member = this
    const token = jwt.sign({ _id: member._id }, process.env.JMT_KEY, { expiresIn: 3000 })
    member.tokens = member.tokens.concat({ token })
    await member.save()
    return token
}

MemberSchema.statics.findByCredentials = async  (email,matkhau) => {
    const member = await Member.findOne({ email })
    if (!member) {
        return 'Email inValid'
    }
    const isPassWordMath = await bcrypt.compare(matkhau, member.matkhau)  //chay ham so sanh mk
    if (!isPassWordMath) {
        return 'Password inCorrect'
    }
    return member
}


const Member = mongoose.model("Member", MemberSchema, "Members");
module.exports = Member;