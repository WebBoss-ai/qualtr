import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

console.log("Initializing Auth Routes...");

// Start Google Authentication
router.get("/google", (req, res, next) => {
  console.log("Initiating Google Authentication...");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google Authentication callback
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google Callback Hit.");
    next();
  },
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Authentication Successful. Generating JWT...");
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    console.log("Token Generated:", token);

    // Set token cookie and redirect
    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    console.log("Cookie Set. Redirecting to Dashboard...");
    res.redirect(`/dashboard?token=${token}`);
  }
);

console.log("Auth Routes Initialized.");

export default router;