import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", (req, res, next) => {
  console.log("Initiating Google Authentication...");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Google Authentication Successful. Generating JWT...");

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

    console.log("Token set in cookie.");

    // Send token & user ID in response for frontend storage
    res.redirect(`/founder-profile/update?token=${token}&userId=${req.user._id}`);
  }
);

console.log("Auth Routes Initialized.");

export default router;
