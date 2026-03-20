const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed password for authentication

  // ✅ NEW FIELD (IMPORTANT)
  isSynthetic: {
    type: Boolean,
    default: false,
  },

  gender: String,
  cleanliness: Number,
  sleep: Number,
  food: Number,
  music: Number,
  study: Number,

  matchHistory: [
    {
      matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      timestamp: { type: Date, default: Date.now },
    },
  ],

  degree: {
    type: String,
    enum: ["BTech", "MTech", "PhD"],
  },

  currentYear: {
    type: String,
    enum: ["1", "2", "3", "4"],
  },
});

module.exports = mongoose.model("User", userSchema);