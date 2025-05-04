const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const session = require("express-session");
const nocache = require("nocache");

// Middle ware to handle sessions
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to prevent caching globally
app.use(nocache());

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Set view engine and views directory
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Hardcoded credentials
const username = "admin";
const password = "admin@123";

// Route: Login page
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/home");
  }

  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });

  res.render("login", { msg: null });
});

// Route: Home page (protected)
app.get("/home", (req, res) => {
  if (req.session.user) {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      Expires: "0",
    });
    return res.render("home");
  } else {
    res.redirect("/");
  }
});

// Route: Login form verification
app.post("/verify", (req, res) => {
  const { username: inputUser, password: inputPass } = req.body;

  if (inputUser === username && inputPass === password) {
    req.session.user = inputUser;
    res.redirect("/home");
  } else {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      Expires: "0",
    });
    res.render("login", { msg: "Invalid username or password" });
  }
});

// Route: Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      Expires: "0",
    });
    res.redirect("/");
  });
});

// Start server
app.listen(3003, () => {
  console.log("✅ Server is running on http://localhost:3000");
});