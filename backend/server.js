const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbConfig = require("./config/dbConfig");

const port = process.env.PORT || 5000;
app.use(express.json());

// routes
const usersRoute = require("./routes/usersRoute");
const busesRoute = require("./routes/busesRoute");

app.use(cors()); // ✅ allow all origins (dev only)

// middleware
app.use(express.json());
app.use("/api/users", usersRoute);
app.use("/api/buses", busesRoute);

app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
});
