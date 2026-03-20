const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const User = require("./models/User"); // ✅ ADD THIS

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// ==============================
// 🔥 INSERT SYNTHETIC USERS ROUTE
// ==============================
app.post("/insert-synthetic", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../ml/synthetic_users.json");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "synthetic_users.json not found" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let inserted = 0;

    for (let user of data) {
      // avoid duplicate emails
      const exists = await User.findOne({ email: user.email });

      if (!exists) {
        await User.create(user);
        inserted++;
      }
    }

    res.json({
      message: "Synthetic users inserted",
      insertedCount: inserted,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error(err));