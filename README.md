# 🏠 Dormie — AI-Powered Roommate Matching System

Dormie is a full-stack web application that intelligently matches roommates based on lifestyle preferences using Machine Learning.

---

## 🚀 Features

* 🔐 User Authentication (Signup/Login)
* 📝 Preference-based Profile Form
* 🤖 ML-powered compatibility scoring
* 🧠 Hybrid Recommendation System:

  * Prioritizes **real users**
  * Uses **synthetic users** to solve cold-start problem
* 📊 Match percentage scoring
* 🕒 Match history tracking
* ⚡ Real-time matching via Flask API

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Material UI

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Machine Learning

* Python
* Scikit-learn (RandomForest)
* Flask API

---

## 🧠 How It Works

### 1. Data Collection

Users fill a form with preferences:

* Cleanliness
* Sleep habits
* Food habits
* Music preference
* Study habits
* Gender, Degree, Year

---

### 2. Synthetic Data Generation

* Thousands of synthetic users are generated
* Used to train ML model
* Also inserted into DB for fallback matching

---

### 3. ML Model Training

* RandomForestClassifier trained on synthetic dataset
* Learns compatibility patterns
* Outputs match probability (0–100%)

---

### 4. Matching Pipeline

1. User submits form
2. Backend fetches:

   * Real users (priority)
   * Synthetic users (fallback)
3. Features sent to Flask API
4. Model predicts match score
5. Results sorted by:

   * Real users first
   * Then highest score

---

## ⚙️ Project Structure

```
Dormie/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   └── roommate-matcher/
│
├── ml/
│   ├── generate_match_data.py
│   ├── model_train.py
│   ├── predict_api.py
│   └── synthetic_users.json
```

---

## 🛠️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/dormie.git
cd dormie
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=your_mongodb_uri
PORT=5000
```

Run backend:

```bash
node server.js
```

---

### 3️⃣ ML Setup

```bash
cd ml
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Generate synthetic users:

```bash
python generate_match_data.py
```

Train model:

```bash
python model_train.py
```

Run ML API:

```bash
python predict_api.py
```

---

### 4️⃣ Insert Synthetic Users

```bash
POST http://localhost:5000/insert-synthetic
```

---

### 5️⃣ Frontend Setup

```bash
cd frontend/roommate-matcher
npm install
npm run dev
```

---

## 📊 Matching Logic

* Input features:

  * Preference differences
  * Same gender, degree, year flags
* Model output:

  * Match probability (%)

---

## 🔥 Key Highlights

* Solves **cold-start problem** using synthetic data
* Uses **ML inference API (Flask)** with Node backend
* Implements **priority-based recommendation system**
* Fully functional **end-to-end ML pipeline**

---

## 🚀 Future Improvements

* 📈 Real user data training
* ⚡ Parallel ML calls for speed
* 📊 Match explanation (why matched)
* 💬 Chat between matched users
* 🎯 Preference weighting system

---

## 👨‍💻 Author

**Samya**

---

