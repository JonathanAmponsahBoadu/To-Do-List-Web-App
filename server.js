const express = require("express");
const app = express();
const path = require("path");

PORT = 3900;
// console.log(__dirname);
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Mainpage.html"));
});
app.listen(PORT, () => {
  console.log(`App running on //localHost:${PORT}`);
});
