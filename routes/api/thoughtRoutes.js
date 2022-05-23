const router = require("express").Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  deleteThought,
} = require("../../controllers/thoughtController");

// /api/students
router.route("/").get(getThoughts).post(createThought);

// /api/students/:studentId
router.route("/:thoughtId").get(getSingleThought).delete(deleteThought);

module.exports = router;
