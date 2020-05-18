const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/dist"));
app.listen(PORT);

// PathLocationStrategy
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname + "/dist/index.html"));
});

console.log("Server Listening!");