const express = require("express");

const userControllers = require("../controllers/userControllers");

const router = express.Router();

// define a Middle Ware Just for this Route but all the routes for this router
router.use((req, res, next) => {
  console.log("Hello User Routers");
  next();
});

// MiddleWare Excuted only if the Param id is exist
router.param("id", (req, res, next, val) => {
  console.log("param id is here");
  next();
});

router
  .route("/")
  .get(userControllers.getUsers)
  .post(userControllers.checkBody, userControllers.postUser);

router
  .route("/:id")
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
