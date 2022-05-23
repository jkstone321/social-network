const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");
const { use } = require("../routes/api");

module.exports = {
  // Get all students
  getThoughts(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single student
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new student
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        User.findOne({ _id: req.body.userId }).then((user) => {
          user.thoughts.push(thought._id);
          user.save();
          res.status(200).json(thought);
        });
      })
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought found with this id!" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  // Delete a student and remove them from the course
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        User.findOne({ _id: thought.userId }).then((user) => {
          const index = user.thoughts.indexOf(req.params.thoughtId);
          user.thoughts.splice(index, 1);
          user.save();
          res.json({ message: "Thought has been deleted!" });
        });
      })
      .catch((err) => res.status(500).json(err));
  },
};
