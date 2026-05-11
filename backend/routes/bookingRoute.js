const router = require("express").Router();
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
const authMiddleware = require("../middlewares/authMiddleware");
const { generateTransactionId } = require("../utils/helper");

// Save book ticket of user
router.post("/book-ticket", authMiddleware, async (req, res) => {
  try {
    const transactionId = generateTransactionId();
    const newBooking = new Booking({
      ...req.body,
      transactionId: transactionId,
      user: req.body.user,
    });
    await newBooking.save();

    // Update bus seats
    const bus = await Bus.findById(req.body.bus);
    bus.seatBooked = [...bus.seatBooked, ...req.body.seats];
    await bus.save();

    res.status(200).send({
      success: true,
      message: "Booking saved successfully",
      data: newBooking,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
