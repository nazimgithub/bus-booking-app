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
  busJourneyEnd: {
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
    enum: ["Yet to Start", "Running", "Completed", "Cancelled"],
    default: "Yet to Start",
  },
  busImages: {
    type: [String],
    default: [],
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "once"],
    default: "daily",
  },
  runningDays: {
    type: [String],
    default: function () {
      if (this.frequency === "daily") {
        return [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
      }
      return [];
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = moongose.model("buses", busSchema);
