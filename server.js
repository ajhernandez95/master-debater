const path = require("path");
const express = require("express");
const serveStatic = require("serve-static");
const app = express();
const port = process.env.PORT || 5000;
app.set("trust proxy", 1);
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

app.use("/", serveStatic(path.join(__dirname, "/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port);
console.log(`Server listening on port ${port}`);
