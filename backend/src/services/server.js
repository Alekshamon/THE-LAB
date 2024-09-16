const express = require("express");
const app = express();
const router = require("./../router");
app.use(express.json());
app.use("/api", router);

app.listen(3000, () => console.info("Running on port 3000"));
