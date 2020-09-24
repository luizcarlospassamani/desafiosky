// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { mongoose } = require('../db/mongoose');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
        trim: true,
        //unique: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email invalido');
            }
        },
    },
    senha: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('senha')) {
                throw new Error('Password cannot contain "senha"');
            }
        },
    },
    telefones: [
        {
            numero: {
                type: String,
                require: true,
                minlength: 8,
                maxlength: 9,
            },
            ddd: {
                type: String,
                require: true,
                minlength: 2,
                maxlength: 3,
            },
        },
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: 15 }
    );

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.statics.findByCredentials = async (email, senha) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable login');
    }
    const isMatch = await bcrypt.compare(senha, user.senha);

    if (!isMatch) {
        throw new Error('Unable login');
    }

    return user;
};

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('senha')) {
        user.senha = await bcrypt.hash(user.senha, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
