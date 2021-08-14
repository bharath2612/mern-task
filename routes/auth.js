const express = require("express");
const router = express.Router();

//middlewares
const { authCheck } = require("../middlewares/auth");

//controllers
const {
  createOrUpdateUser,
  currentUser,
  validateUser,
  checkUser,
} = require("../controllers/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/validate-user", authCheck, validateUser);
router.post("/check-user", checkUser);
router.post("/current-user", authCheck, currentUser); //for user

module.exports = router;
