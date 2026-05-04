const router = require("express").Router();
const Bus = require("../models/busModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Get All Buses
router.post("/get-all-buses", authMiddleware, async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).send({
      success: true,
      message: "Buses fetch successfully!",
      data: buses,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Add New Bus
router.post("/add-bus", async (req, res) => {
  try {
    const exsitingBus = await Bus.findOne({ busNumber: req.body.busNumber });
    if (exsitingBus) {
      return res.status(200).send({
        success: false,
        message: "Bus already exists",
      });
    }

    const newBus = new Bus(req.body);
    await newBus.save();

    res.status(200).send({
      success: true,
      message: "Bus added successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// update bus
router.put("/update-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndUpdate(req.body._id, req.body);
    res.status(200).send({
      success: true,
      message: "Bus updated successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
