const axios = require("axios");

/**
 * Fetch ML match score
 */
async function fetchMatchScore(user, other) {
  try {
    const payload = {
      // ✅ IMPORTANT: send DIFFERENCE (not raw values)
      cleanliness: Math.abs(user.cleanliness - other.cleanliness),
      sleep: Math.abs(user.sleep - other.sleep),
      food: Math.abs(user.food - other.food),
      music: Math.abs(user.music - other.music),
      study: Math.abs(user.study - other.study),

      same_gender: user.gender === other.gender ? 1 : 0,
      same_degree: user.degree === other.degree ? 1 : 0,
      same_year: user.currentYear === other.currentYear ? 1 : 0,
    };

    const res = await axios.post("http://localhost:5001/predict", payload);

    return res.data.match_score || 0;
  } catch (err) {
    console.error("ML model error:", err.message);
    return 0;
  }
}

/**
 * MAIN MATCH FUNCTION
 */
async function getTopMatches(user, others) {
  // ==============================
  // 🔥 STEP 1: Separate users
  // ==============================
  const realUsers = others.filter((o) => !o.isSynthetic);
  const syntheticUsers = others.filter((o) => o.isSynthetic);

  // ==============================
  // 🔥 STEP 2: Prioritize real users
  // ==============================
  let candidates = [];

  if (realUsers.length >= 5) {
    candidates = realUsers;
  } else {
    candidates = [...realUsers, ...syntheticUsers];
  }

  // Limit for performance
  candidates = candidates.slice(0, 50);

  const matches = [];

  // ==============================
  // 🔥 STEP 3: ML scoring
  // ==============================
  for (const other of candidates) {
    const score = await fetchMatchScore(user, other);

    matches.push({
      ...other.toObject(),
      matchScore: score,
      priority: other.isSynthetic ? 0 : 1, // real users first
    });
  }

  // ==============================
  // 🔥 STEP 4: Sort
  // ==============================
  matches.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority; // real first
    }
    return b.matchScore - a.matchScore;
  });

  // ==============================
  // 🔥 STEP 5: Filter (RELAXED)
  // ==============================
  return matches.filter((m) => m.matchScore > 30).slice(0, 10);
}

module.exports = getTopMatches;