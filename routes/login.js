const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guest-controller.js");
const userController = require("../controllers/user-controller.js")


router.route("/").get(guestController.checkAuthenticated,guestController.loginRender)

router.route("/").post(guestController.userLogin);



module.exports = router;