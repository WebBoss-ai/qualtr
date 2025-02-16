import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import DigitalMarketer from "../models/DigitalMarketer.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID || "default-client-id",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "default-client-secret",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8000/auth/google/callback",
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        // Find or create the user
        let user = await DigitalMarketer.findOne({ email });
        if (!user) {
          user = await DigitalMarketer.create({
            email,
            profile: { fullname: profile.displayName },
            googleId: profile.id, // Store the Google ID
            password: "oauth-user", // Dummy password
        });        
        } else {
          console.log("User found:", user);
        }
        done(null, user);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await DigitalMarketer.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Error in Deserializing User:", error);
    done(error, null);
  }
});

