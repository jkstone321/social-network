const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  updateFriends,
  deleteFriends,
} = require("../../controllers/userController.js");

// /api/users
router.route("/").get(getUsers).post(createUser);

// /api/users/:userId
router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
router
  .route("/:userId/friends/:friendId")
  .put(updateFriends)
  .delete(deleteFriends);

module.exports = router;
