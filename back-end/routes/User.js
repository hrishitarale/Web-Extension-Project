const router = require("express").Router();
const clientController = require("../controller/User")
const auth_middleware = require("../middleware/auth-middleware")


router.get("/testClient", (req, res) => {
    res.send("Client routes is Up and proper running")
})


router.post("/register", clientController?.registerUser);
router.post("/login", clientController?.login);

router.get('/search/:word', auth_middleware, clientController?.searchMeaning);
router.get('/transalate', auth_middleware, clientController?.transalate);




module.exports = router;