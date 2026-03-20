const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../middleware/auth");
const axios = require("axios");

// ===============================
// MATCHING FUNCTION (ML BASED)
// ===============================
async function getTopMatches(currentUser, allUsers) {
  let matches = [];

  for (let other of allUsers) {
    const payload = {
      cleanliness: Math.abs(currentUser.cleanliness - other.cleanliness),
      sleep: Math.abs(currentUser.sleep - other.sleep),
      food: Math.abs(currentUser.food - other.food),
      music: Math.abs(currentUser.music - other.music),
      study: Math.abs(currentUser.study - other.study),
      same_gender: currentUser.gender === other.gender ? 1 : 0,
      same_degree: currentUser.degree === other.degree ? 1 : 0,
      same_year: currentUser.currentYear === other.currentYear ? 1 : 0,
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/predict",
        payload
      );

      const score = response.data.match_score;

      // relaxed threshold
      if (score > 30) {
        matches.push({
          ...other.toObject(),
          matchScore: score,
          priority: other.isSynthetic ? 0 : 1, // 🔥 real users priority
        });
      }
    } catch (err) {
      console.error("ML API error:", err.message);
    }
  }

  // 🔥 SORT: real users first, then score
  matches.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return b.matchScore - a.matchScore;
  });

  return matches.slice(0, 10);
}

// ===============================
// FORM SUBMISSION
// ===============================
router.post("/form", authenticate, async (req, res) => {
  try {
    if (req.body.email !== req.userEmail)
      return res.status(403).json({ message: "Email mismatch" });

    const updated = await User.findOneAndUpdate(
      { email: req.userEmail },
      {
        gender: req.body.gender,
        cleanliness: req.body.cleanliness,
        sleep: req.body.sleep,
        food: req.body.food,
        music: req.body.music,
        study: req.body.study,
        currentYear: req.body.currentYear,
        degree: req.body.degree,
      },
      { new: true }
    );

    // ==============================
    // 🔥 FIXED PRIORITY FETCH
    // ==============================

    // 1️⃣ Fetch real users first
    let realUsers = await User.find({
      _id: { $ne: updated._id },
      isSynthetic: false,
      cleanliness: { $exists: true },
    }).limit(20);

    // 2️⃣ Add synthetic only if needed
    let syntheticUsers = [];

    if (realUsers.length < 5) {
      syntheticUsers = await User.find({
        isSynthetic: true,
      }).limit(30);
    }

    // 3️⃣ Combine
    const all = [...realUsers, ...syntheticUsers];

    // ==============================

    const matches = await getTopMatches(updated, all);

    if (!Array.isArray(matches)) {
      return res.status(500).json({ message: "Matching failed" });
    }

    // Store match history
    updated.matchHistory.unshift({
      matches: matches.map((m) => m._id),
      timestamp: new Date(),
    });

    await updated.save();

    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// MATCH HISTORY
// ===============================
router.get("/history/:email", authenticate, async (req, res) => {
  try {
    if (req.params.email !== req.userEmail)
      return res.status(403).json({ message: "Unauthorized access" });

    const user = await User.findOne({ email: req.params.email })
      .populate(
        "matchHistory.matches",
        "name email gender cleanliness sleep food music study degree currentYear isSynthetic"
      )
      .exec();

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ history: user.matchHistory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// LATEST RESULTS
// ===============================
router.get("/results/:email", authenticate, async (req, res) => {
  try {
    if (req.params.email !== req.userEmail)
      return res.status(403).json({ message: "Unauthorized access" });

    const user = await User.findOne({ email: req.params.email })
      .populate(
        "matchHistory.matches",
        "name email gender cleanliness sleep food music study degree currentYear isSynthetic"
      )
      .exec();

    if (!user || !user.matchHistory.length)
      return res.status(404).json({ message: "No match history found" });

    const latest = user.matchHistory[0];

    res.json({
      matches: latest.matches,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;