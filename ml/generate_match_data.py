import random
import json

# ==============================
# CONFIG
# ==============================
NUM_USERS = 2000   # number of synthetic users

# ==============================
# GENERATE RANDOM USER
# ==============================

def random_profile():
    return {
        "name": f"user_{random.randint(10000, 99999)}",
        "email": f"synthetic_{random.randint(100000,999999)}@test.com",
        "password": "dummy",  # not used for synthetic users

        # Preferences (NOW 1–10 ✅)
        "cleanliness": random.randint(1, 10),
        "sleep": random.randint(1, 10),
        "food": random.randint(1, 10),
        "music": random.randint(1, 10),
        "study": random.randint(1, 10),

        # Profile info
        "gender": random.choice(["male", "female", "other"]),
        "degree": random.choice(["BTech", "MTech", "PhD"]),
        "currentYear": str(random.randint(1, 4)),

        # IMPORTANT FLAG
        "isSynthetic": True
    }

# ==============================
# GENERATE USERS
# ==============================

users = []

for _ in range(NUM_USERS):
    users.append(random_profile())

# ==============================
# SAVE FILE
# ==============================

with open("synthetic_users.json", "w") as f:
    json.dump(users, f, indent=2)

print(f"✅ Generated {NUM_USERS} synthetic users (1–10 scale)")