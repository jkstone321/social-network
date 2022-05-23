const router = require("express").Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

/*
Example JSON for creating a new thought:
{
  "thoughtText": "I just had a thought!",
  "username": "Lernantino",
  "userId": {PULL FROM API}
}
*/

// /api/thoughts
router.route("/").get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router.route("/:thoughtId").get(getSingleThought).put(updateThought).delete(deleteThought);

/*
Example JSON for creating a new reaction:
{
  "reactionBody": "Wow what a cool thought you have thunked!",
  "username": "Frederick"
}
*/

// /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(addReaction);

// /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);
module.exports = router;
