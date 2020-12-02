const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guest-controller.js");
const userController = require("../controllers/user-controller.js");

// function middleware(req,res,next){
//     console.log("MIDDLEWARE !!");
//     const guest = false;
//     req.guest = guest;
//     next();
// }

// router.route("/").get(middleware,eventsController.indexPageRender,userController.indexPageRenderU)

router.route("/").get(guestController.checkAuthenticated,userController.favouritesRender);


module.exports = router;