const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phone: { type: Number, required: false },
    password: { type: String, required: true, trim: true },
    searchKeyWords: [],
    transalateTexts: []
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel;