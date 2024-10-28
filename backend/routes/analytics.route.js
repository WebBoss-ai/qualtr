import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.route("/").get(getAnalytics);

export default router;
