const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate({ path: "friends", select: "-__v" })
      .populate({ path: "thoughts", select: "-__v" })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and thoughts deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a friend
  updateFriends(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((user) => {
        user.friends.push(req.params.friendId);
        console.log(user);
        user.save();
        res.status(200).json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
  // Remove a friend
  deleteFriends(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((user) => {
        const index = user.friends.indexOf(req.params.friendId);
        if (index > -1) {
          user.friends.splice(index, 1);
          user.save();
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .json({ message: "User has no friends with that id!" });
        }
      })
      .catch((err) => res.status(500).json(err));
  },
};
