const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    phone_no: {
        type: Number,
        max: 9999999999,
        min: 1000000000,
        required: true,
        trim: true,
        unique: true
    },
    address: {
        street: String,
        city: String,
        state: {
            type: String,
            uppercase: true,
            required: true,
            enum: ["TAMILNADU", "KERALA", "KARNATAKA", "A.P"]
        },
        pincode: Number
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function () {
    var user = this;
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});

UserSchema.statics.findByCredential = async function(name, password){
    var user = await User.findOne({name:name});
    if(!user){
        throw new Error("Unable to Login");
    }
    var check = await bcrypt.compare(password, user.password);

    if(!check){
        throw new Error("Unable to Login");
    }
    return user;
}

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var token = jwt.sign({_id: user._id},'thisistask');
    return token;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;