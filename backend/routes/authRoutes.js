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
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Google Authentication Successful. Generating JWT...");

    // Check if user is available
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("Generated Token:", token);

    // Set token in HttpOnly cookie
    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Ensure frontend can access it
    });

    console.log("Token set in cookie. Redirecting to profile...");
    res.redirect(`/founder-profile/update`);
  }
);

console.log("Auth Routes Initialized.");

export default router;