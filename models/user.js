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
  },
  email: {
    type: String,
    unique: true,
    require: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Unable email');
      }
    },
  },
  senha: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
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

// eslint-disable-next-line
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    // eslint-disable-next-line
    { _id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: 1800 },
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, senha) => {
  // eslint-disable-next-line
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(404); // 'Unable login/password'
  }
  const isMatch = await bcrypt.compare(senha, user.senha);

  if (!isMatch) {
    throw new Error(401); // 'Unable password'
  }

  return user;
};

// eslint-disable-next-line
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('senha')) {
    user.senha = await bcrypt.hash(user.senha, 8);
  }

  next();
});

userSchema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Existing email'));
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
