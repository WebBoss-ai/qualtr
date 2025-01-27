import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import DigitalMarketer from "../models/DigitalMarketer.js";

console.log("Initializing Passport...");

passport.use(
  new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID || "default-client-id",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "default-client-secret",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
      },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Strategy Callback Triggered.");
      console.log("Access Token:", accessToken);
      console.log("Profile:", profile);

      try {
        const email = profile.emails[0].value;
        console.log("User Email:", email);

        // Find or create the user
        let user = await DigitalMarketer.findOne({ email });
        if (!user) {
          console.log("User not found. Creating new user...");
          user = await DigitalMarketer.create({
            email,
            profile: {
              fullname: profile.displayName,
            },
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
  console.log("Serializing user:", user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await DigitalMarketer.findById(id);
    console.log("Deserialized User:", user);
    done(null, user);
  } catch (error) {
    console.error("Error in Deserializing User:", error);
    done(error, null);
  }
});

console.log("Passport initialized.");