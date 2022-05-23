const express = require("express");
const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single thought
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
  // create a new thought
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
  // Edit a thought
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
  // Delete a thought and remove thought from user
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
  //add a reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    ).then((thought) => {
      !thought
        ? res.status(404).json({ message: "No thought found with that id!" })
        : res.json(thought);
    });
  },
  deleteReaction(req, res) {
    Thought.findOne({ _id: req.params.thoughtId }).then((thought) => {
      const index = thought.reactions.indexOf(req.params.reactionId);
      thought.reactions.splice(index, 1);
      thought.save();
      res.json({ message: "Reaction has been deleted!" });
    });
  },
};
