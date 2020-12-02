const express =require("express");
const guestController = require("../controllers/guest-controller.js")
const userController = require("../controllers/user-controller.js")
const router = express.Router();

// router.route("/:articleId").get(eventsController.articleRender)
router.route("/:articleId").get(guestController.checkAuthenticated,userController.articleRenderU,guestController.articleRender)

module.exports = router;