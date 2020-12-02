const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guest-controller.js")
const userController = require("../controllers/user-controller.js")


// router.get("/:cityName",(req,res,next)=>{
//    const cityName = req.params.cityName;
//    res.send("You are at "+cityName);
// });

// router.route("/:cityName").get(eventsController.cityRender);
router.route("/:cityName").get(guestController.checkAuthenticated,userController.cityRenderU,guestController.cityRender)


module.exports = router;