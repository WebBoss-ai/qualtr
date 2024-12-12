import express from "express";
import { login, logout, register, updateProfile, getUsersByRole } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import { getAdminDashboard } from "../controllers/admin.controller.js";

const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/admin").get(isAuthenticated, getAdminDashboard);
router.route("/users-by-role").get(getUsersByRole);

export default router;

