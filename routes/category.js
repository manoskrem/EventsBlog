const express =require("express");
const guestController = require("../controllers/guest-controller.js") 
const userController = require("../controllers/user-controller.js")
const router = express.Router();

// router.route("/:categoryName").get(eventsController.categoryRender);
router.route("/:categoryName").get(guestController.checkAuthenticated,userController.categoryRenderU,guestController.categoryRender)


module.exports = router;