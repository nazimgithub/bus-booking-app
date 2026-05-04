const moongose = require("mongoose");

const busSchema = new moongose.Schema({
  busNumber: {
    type: String,
    required: true,
  },
  busName: {
    type: String,
    required: true,
    unique: true,
  },
  busCapacity: {
    type: Number,
    required: true,
  },
  busForm: {
    type: String,
    required: true,
  },
  busTo: {
    type: String,
    required: true,
  },
  busJourney: {
    type: Date,
    required: true,
  },
  busDeparture: {
    type: String,
    required: true,
  },
  busArrival: {
    type: String,
    required: true,
  },
  busType: {
    type: String,
    required: true,
  },
  busPrice: {
    type: Number,
    required: true,
  },
  seatBooked: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "Yet to start",
  },
});

module.exports = moongose.model("buses", busSchema);
