const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, "users.json");

app.use(express.json());
app.use(express.static("public"));

// Read users from JSON file
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

// Write users to JSON file
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  users.push({ email, password });
  writeUsers(users);
  res.json({ message: "Registered successfully" });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
