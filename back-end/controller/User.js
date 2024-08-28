const dotenv = require('dotenv').config()
const userModel = require('../model/User-model');
const jwt = require("jsonwebtoken");
const axios = require('axios');
const moment = require('moment-timezone');

class clientControllers {
    static login = async (req, res) => {  // active
        const { email, password } = req?.body;

        if (email && password) {
            let User = await userModel.findOne({ email: email });
            if (User) {
                if (email == User?.email && password == User?.password) {
                    const data = { name: User?.username, email: User?.email, phone: User?.phone };
                    const token = jwt.sign({ userID: User?._id }, process?.env?.JWT_SECRET_KEY, { expiresIn: '1d' });
                    res.send({ status: "SUCCESS", message: "Login Success", token: token, data: data });
                } else {
                    res.send({ status: "FAIL", message: "Email and password is incorrect", code: "400" });
                }
            } else {
                res.send({ status: "FAIL", message: "Email already registred", code: "400" });
            }
        } else {
            res.send({ status: "FAIL", message: "All fiels are required", code: "400" });
        }

    }

    static registerUser = async (req, res) => { // active
        const { username, email, phone, password } = req?.body;
        const userData = await userModel.findOne({ email: email });
        if (userData) {
            res.send({ status: "Failed", message: "Email already Registered" })
        } else {
            if (username && email && phone && password) {
                let phoneData = await userModel.findOne({ phone: phone });
                if (!phoneData) {
                    try {
                        const newUser = new userModel({
                            username: username,
                            email: email,
                            password: password,
                            phone
                        });
                        const saveResponse = await newUser.save();
                        let User = await userModel.findOne({ email: email });
                        const data = { name: User?.username, email: User?.email, phone: User?.phone };
                        const token = jwt.sign({ userID: User?._id }, process?.env?.JWT_SECRET_KEY, { expiresIn: '1d' });
                        return res.send({ status: "SUCCESS", message: "Client Register Successfully", token: token, data: data })

                    } catch (err) {
                        res.send({ status: "FAILED", message: "Unable to register client ", error: err?.message })
                    }
                } else {
                    res.send({ status: "FAILED", message: "Phone number already exist" })
                }
            } else {
                res.send({ status: "FAILED", message: "All fields are required" })
            }
        }
    }

    static searchMeaning = async (req, res) => {
        let userID = req?.id
        let searchQuery = req?.params?.word;
        try {
            let apiURL = "https://api.dictionaryapi.dev/api/v2/entries/en/" + searchQuery;
            let apiResponse = await axios.get(apiURL);

            // If the request is successful (status code 200)
            if (apiResponse?.status === 200) {
                const asiaKolkataTime = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                let searchObj = {
                    TandD: asiaKolkataTime,
                    keyword: searchQuery
                }
                await userModel.findByIdAndUpdate(
                    userID,
                    { $push: { searchKeyWords: searchObj } },
                    { new: true }
                )
                res.send({ status: "SUCCESS", data: apiResponse?.data });
            } else {
                res.status(apiResponse?.status).send('Request failed with status code ' + apiResponse?.status);
            }
        } catch (error) {
            // Handle Axios errors here
            if (error?.response && error?.response?.status === 404) {
                // Handle 404 Not Found error
                res.status(404).send({
                    title: 'No Definitions Found',
                    message: "Sorry pal, we couldn't find definitions for the word you were looking for.",
                    resolution: 'You can try the search again at later time or head to the web instead.'
                });
            } else {
                // Handle other errors or status codes
                console.error(error);
                res.status(500).send("An error occurred while processing your request.");
            }
        }
    }

    static transalate = async (req, res) => {
        let { text, fromL, toL } = req?.query;
        let userID = req?.id
        try {
            let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromL}|${toL}`;
            let apiResponse = await axios.get(apiURL);

            // If the request is successful (status code 200)
            if (apiResponse?.status === 200) {
                if (apiResponse?.data?.responseStatus == "403") {
                    res.send(apiResponse?.data)
                } else {
                    const asiaKolkataTime = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
                    let transObj = {
                        TandD: asiaKolkataTime,
                        from: fromL,
                        to: toL,
                        text,
                        result: apiResponse?.data?.responseData?.translatedText
                    }
                    await userModel.findByIdAndUpdate(
                        userID,
                        { $push: { transalateTexts: transObj } },
                        { new: true }
                    )
                    res.send({ status: "SUCCESS", data: apiResponse?.data });
                }

            } else {
                res.status(apiResponse?.status).send('Request failed with status code ' + apiResponse?.status);
            }
        } catch (error) {
            // Handle Axios errors here
            if (error?.response && error?.response?.status === 404) {
                // Handle 404 Not Found error
                res.status(404).send({ status: "ERROR", message: "Unable to transalate" });
            } else {
                // Handle other errors or status codes
                console.error(error);
                res.status(500).send({ status: "ERROR", message: "Too much load try again later....." });
            }
        }

    }

}
module.exports = clientControllers