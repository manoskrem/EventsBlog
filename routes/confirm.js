const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guest-controller.js");
// const userController = require("../controllers/user-controller.js")


router.route("/").get(guestController.checkAuthenticated,guestController.confirmRegistration)

// router.route("/login").post(userController.userLogin);
// router.route("/sign-up").post(userController.userSignUp);
// router.route("/").get(userController.confirmRegistration);


module.exports = router;