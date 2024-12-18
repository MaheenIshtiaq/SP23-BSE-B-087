const express = require("express");
const path = require("path"); // To handle file paths

let server = express();

// Set the view engine to EJS
server.set("view engine", "ejs");

// Set the path for the 'views' folder
server.set("views", path.join(__dirname, "views"));

// Define a route
server.get("/about.me", (req, res) => {
    res.render("about.me");  // Renders the 'about.me.ejs' file from the 'views' folder
});

// Start the server
server.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
});
