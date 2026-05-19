const router = require("express").Router();
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
const authMiddleware = require("../middlewares/authMiddleware");
const { generateTransactionId } = require("../utils/helper");
const { v4: uuid } = require("uuid");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Save book ticket of user
router.post("/book-ticket", authMiddleware, async (req, res) => {
  try {
    // const transactionId = generateTransactionId();
    const newBooking = new Booking({
      ...req.body,
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

// ======================================================
// CREATE PAYMENT INTENT
// ======================================================
router.post("/create-payment-intent", async (req, res) => {
  try {
    const {
      amount,
      seats,

      // Billing Details
      name,
      email,
      line1,
      city,
      state,
      postal_code,
      country,
    } = req.body;

    // ==========================================
    // VALIDATIONS
    // ==========================================
    if (!amount) {
      return res.status(400).send({
        success: false,
        message: "Amount is required",
      });
    }

    if (!name || !email) {
      return res.status(400).send({
        success: false,
        message: "Customer name and email are required",
      });
    }

    // ==========================================
    // CREATE PAYMENT INTENT
    // ==========================================
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),

      currency: "inr",

      // Required for India Export Regulations
      description: `Bus ticket booking for seats: ${
        seats?.join(", ") || "selected seats"
      }`,

      // Customer Email
      receipt_email: email,

      // Shipping/Billing Details
      shipping: {
        name: name,

        address: {
          line1: line1 || "",
          city: city || "",
          state: state || "",
          postal_code: postal_code || "",
          country: country || "IN",
        },
      },

      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        integration_check: "bus_booking_app",
        seats: seats?.join(", ") || "",
      },
    });

    // ==========================================
    // RESPONSE
    // ==========================================
    return res.status(200).send({
      success: true,

      // Stripe Payment Intent ID
      transactionId: paymentIntent.id,

      // Payment Status
      status: paymentIntent.status,

      // Client Secret for Frontend
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("Stripe Error:", error);

    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Get All Bookings
router.get("/get-all-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).send({
      success: true,
      message: "Bookings fetch successfully!",
      data: bookings,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Get booking by user id
router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.user })
      .populate("bus")
      .populate("user");
    res.status(200).send({
      success: true,
      message: "Bookings fetch successfully!",
      data: bookings,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: error.message, data: error });
  }
});

module.exports = router;
