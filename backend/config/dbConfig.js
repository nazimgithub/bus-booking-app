const moongoose = require("mongoose");

moongoose.connect("mongodb://127.0.0.1:27017/bus-ticketing-app");

const db = moongoose.connection;

db.on("error", (error) => {
  console.log(error);
});

db.on("connected", () => {
  console.log("Database connected");
});
