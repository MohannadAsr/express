const fs = require("fs"); // require File System

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../users.json`, "utf-8")
); // Read from Json File

exports.getUsers = (req, res) => {
  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
};

exports.postUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUsers = Object.assign(
    { id: newId, createdDate: req.date },
    req.body
  );
  users.push(newUsers);
  fs.writeFile("./users.json", JSON.stringify(users), (err) => {
    res.status(201).json({ status: "sucess", data: { user: newUsers } });
  });
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.time) {
    return res
      .status(400)
      .json({ status: "Bad Request", message: "Invalid Data submitted" });
  }
  next();
};

exports.getUser = (req, res) => {
  const user = users.find((item) => item.id === parseInt(req.params.id));

  user
    ? res.status(200).json({ user })
    : res.status(404).json({ status: "not found", message: "User Not found" });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
