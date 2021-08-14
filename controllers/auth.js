const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { phone_number } = req.user;
  const { fname, lname, email, password } = req.body.details;

  const user = await User.findOne({ phone_number: phone_number }).exec();

  if (user) {
    console.log("PhoneNumber Taken", user);
    return res.json({ err: "PhoneNumber already registered" });
  } else {
    const newUser = await new User({
      phone_number,
      fname,
      password,
    }).save();
    res.json(newUser);
    console.log("USER CREATED", newUser);
  }
};

exports.checkUser = async (req, res) => {
  const { phoneNumber } = req.body.phoneNumber;

  const user = await User.findOne({ phone_number: phoneNumber }).exec();

  if (user === null) {
    return res.json({
      err: "User not Signed up",
    });
  } else {
    res.json({ ok: "User Already registered" });
    console.log("User Already registered");
  }
};

exports.validateUser = async (req, res) => {
  const { phone_number } = req.user;

  const user = await User.findOne({ phone_number: phone_number }).exec();

  if (user === null) {
    return res.json({
      err: "User not Signed up",
    });
  }

  res.json(user);
  console.log("USER LOGIN", user);
};

exports.currentUser = async (req, res) => {
  User.findOne({ phone_number: req.user.phone_number }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};
