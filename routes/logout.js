const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller.js")


router.route("/").get(userController.logout);



module.exports = router;