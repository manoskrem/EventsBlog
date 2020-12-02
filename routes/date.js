const express =require("express");
const guestController = require("../controllers/guest-controller.js")
const userController = require("../controllers/user-controller.js")
const router = express.Router();


// router.route("/:date").get(eventsController.dateRender);
router.route("/:date").get(guestController.checkAuthenticated,userController.dateRenderU,guestController.dateRender)



module.exports = router;