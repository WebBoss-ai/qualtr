import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").get(isAuthenticated,getAnalytics);

export default router;
