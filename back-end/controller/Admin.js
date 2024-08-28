const userModel = require('../model/User-model');
const XLSX = require('xlsx');
const jwt = require("jsonwebtoken");
require('dotenv').config();

class AdminController {
    static login = async (req, res) => {
        let { email, password } = req?.body;
        if (email && password) {
            if (email === "admin@admin.com" && password === "Admin@123") {
                const data = { name: "Admin", email: email };
                const token = jwt.sign({ userID: email }, process?.env?.JWT_SECRET_KEY, { expiresIn: '1d' });
                return res.send({ status: "SUCCESS", message: "successfully login", token: token, data: data });
            }
            return res.send({ status: "FAILED", message: "Emaiil and password not valid" })

        } else {
            return res.send({ status: "FAILED", message: "All fields are required" });
        }
    }

    static getUsersList = async (req, res) => {
        let users = await userModel.find({});
        res.send({ status: "SUCCESS", data: users });
    }

    static getExcelBuffer = async (req, res) => {
        let { id } = req?.query;

        let usersData = [];
        if (id !== undefined && id !== "") {
            usersData = await userModel.find({ _id: id });
        }
        if (usersData !== undefined && usersData.length > 0) {
            const workbook = XLSX?.utils.book_new();
            usersData.forEach((user, index) => {
                const worksheetData = [
                    ['Username', 'Email', 'Phone'],
                    [user?.username, user?.email, user?.phone],
                    [], // Blank row for separation
                    ['Search Keywords'],
                    ['Date and Time', 'Keyword'],
                    ...user?.searchKeyWords.map(item => [item?.TandD, item?.keyword]),
                    [], // Blank row for separation
                    ['Translate Texts'],
                    ['From', 'To', 'Text', 'Result'],
                    ...user?.transalateTexts.map(item => [item?.from, item?.to, item?.text, item?.result])
                ];

                const ws = XLSX?.utils.aoa_to_sheet(worksheetData);

                // Set the column width (adjust width as needed)
                ws['!cols'] = [
                    { wch: 20 }, // Width for the 1st column
                    { wch: 30 }, // Width for the 2nd column
                    { wch: 20 }, // Width for the 3rd column
                    // ... Add more as needed
                ];

                XLSX?.utils.book_append_sheet(workbook, ws, `${user?.username}-${index + 1}`);
            });
            // Convert the workbook to a buffer
            const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="output.xlsx"'
            });
            // res.send({ message: "SUCCESS", buffer: excelBuffer });
            res.send(excelBuffer);
        } else {
            res.status(500).send({ status: "ERROR", message: "Too much load try again later....." });
        }
    }
}


module.exports = AdminController;