const mongoose = require('mongoose')
const dotenv = require("dotenv").config();

const OPTIONS = {
    dbName: "DATA"
}

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process?.env?.MONGO_CONNECTION_URL, OPTIONS)
        console.log('Connected Successfully');
    } catch (error) {
        console.log("ERROR:- ", error)
    }
}


module.exports = connectDB;