const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guest-controller.js");
const userController = require("../controllers/user-controller.js");


router.route("/").get(guestController.checkAuthenticated,userController.indexPageRenderU,guestController.indexPageRender);


router.route("/addfavourite/:event_id").get(guestController.checkAuthenticated , userController.addFavourite);
router.route("/showInterest/:event_id").get(guestController.checkAuthenticated , userController.showInterest);

module.exports = router;