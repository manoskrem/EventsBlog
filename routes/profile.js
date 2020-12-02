const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guest-controller.js");
const userController = require("../controllers/user-controller.js")


router.route("/").get(guestController.checkAuthenticated,userController.profileRender);

router.route("/").post(guestController.checkAuthenticated,userController.updateUser);

router.route("/delete").get(guestController.checkAuthenticated,userController.deleteUser);


module.exports = router;