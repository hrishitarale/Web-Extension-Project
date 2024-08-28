const router = require("express").Router();
const adminController = require("../controller/Admin")
const auth_middleware = require("../middleware/auth-middleware")


router.get("/testadmin", (req, res) => {
    res.send("Client routes is Up and proper running")
})


router.post('/login', adminController?.login);
router.get('/getusers', adminController?.getUsersList);
router.get('/excel', adminController?.getExcelBuffer);




module.exports = router;