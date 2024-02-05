const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");

const upload = require("../middlewares/upload");

const {
  getUsers,
  getUser,
  register,
  login,
  getUserByUsername,  // searchByCourse,
  updateUser,
  deleteUser,
  uploadImage,
  getMe,
} = require("../controller/UserController");
router.post("/uploadImage", upload, uploadImage);
router.post("/register", register);
router.get("/getUserbyName/:username", protect,getUserByUsername);
router.post("/login", login);
router.get("/getAllUsers", protect, getUsers);
// router.get("/getStudentsByBatch/:batchId", protect, searchByBatch);
// router.get("/getStudentsByCourse/:courseId", protect, searchByCourse);
router.put("/updateUser/:id", protect, updateUser);
router.delete("/deleteUser/:id", protect, deleteUser);
router.get("/getMe/:id", protect, getMe);
router.get("/getUser/:id", protect, getUser);

module.exports = router;
