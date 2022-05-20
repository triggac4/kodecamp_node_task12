const router = require("express").Router();
const userController = require("../controller/user");


router.route("/").get(userController.getAllUsers);
router.route("/signIn").get(userController.signIn);
router.route("/signUp").post(userController.signUp);
router.route("/refresh").get(userController.refreshAccessToken);
router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
