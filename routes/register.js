const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guest-controller.js");
const userController = require("../controllers/user-controller.js")


router.route("/").get(guestController.checkAuthenticated,guestController.registerRender)


router.route("/").post(guestController.userSignUp);

module.exports = router;