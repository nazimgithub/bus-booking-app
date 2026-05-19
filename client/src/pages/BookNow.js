import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message, Row, Col, Input } from "antd";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { axiosInstance } from "../helpers/axiosInstance";
import { hideLoading, showLoading } from "../redux/alertSlice";

import SeatSelection from "../components/SeatSelection";

function BookNow({ clientSecret }) {
  const params = useParams();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const stripe = useStripe();
  const elements = useElements();

  const [bus, setBus] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);

  // Billing Details
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "IN",
  });

  // ======================================================
  // GET BUS DETAILS
  // ======================================================
  const getBus = async () => {
    try {
      dispatch(showLoading());

      const response = await axiosInstance.post(
        "http://localhost:5000/api/buses/get-bus-by-id",
        {
          _id: params.id,
        },
      );

      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getBus();
  }, []);

  // ======================================================
  // BOOK TICKET
  // ======================================================
  const bookNow = async (transactionId) => {
    try {
      dispatch(showLoading());

      const response = await axiosInstance.post(
        "http://localhost:5000/api/booking/book-ticket",
        {
          bus: bus._id,
          seats: selectedSeats,

          // Replace with logged in user ID
          user: userId,

          transactionId,
        },
      );

      if (response.data.success) {
        message.success("Ticket Booked Successfully");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  // ======================================================
  // HANDLE PAYMENT
  // ======================================================
  const handlePayment = async () => {
    try {
      // Validate Seats
      if (selectedSeats.length === 0) {
        return message.error("Please select at least one seat");
      }

      // Validate Billing Details
      if (
        !billingDetails.name ||
        !billingDetails.email ||
        !billingDetails.line1 ||
        !billingDetails.city ||
        !billingDetails.state ||
        !billingDetails.postal_code
      ) {
        return message.error("Please fill all billing details");
      }

      // Stripe Loaded Check
      if (!stripe || !elements) {
        return message.error("Stripe has not loaded yet");
      }

      dispatch(showLoading());

      // Submit Payment Element
      const { error: submitError } = await elements.submit();

      if (submitError) {
        dispatch(hideLoading());
        return message.error(submitError.message);
      }

      // ======================================================
      // CONFIRM PAYMENT
      // ======================================================
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,

        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,

              address: {
                line1: billingDetails.line1,
                city: billingDetails.city,
                state: billingDetails.state,
                postal_code: billingDetails.postal_code,
                country: billingDetails.country,
              },
            },
          },

          return_url: "http://localhost:3000/success",
        },

        redirect: "if_required",
      });

      // ======================================================
      // PAYMENT ERROR
      // ======================================================
      if (result.error) {
        dispatch(hideLoading());

        return message.error(result.error.message);
      }

      // ======================================================
      // PAYMENT SUCCESS
      // ======================================================
      if (result.paymentIntent.status === "succeeded") {
        await bookNow(result.paymentIntent.id);

        message.success("Payment Successful");
      } else {
        message.warning(`Payment Status: ${result.paymentIntent.status}`);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={20}>
          {/* ====================================================== */}
          {/* LEFT SECTION */}
          {/* ====================================================== */}
          <Col lg={12} sm={24} xs={24}>
            <h1 className="text-lg text-secondary">
              <b>{bus.busName}</b>
            </h1>

            <h1 className="text-md">
              {bus.busForm} - {bus.busTo}
            </h1>

            <hr />

            {/* BUS DETAILS */}
            <div className="flex flex-col gap-2">
              <h1 className="text-md">Journey Date: {bus.busJourney}</h1>

              <h1 className="text-md">Fare: ₹{bus.busPrice}</h1>

              <h1 className="text-md">Departure Time: {bus.busDeparture}</h1>

              <h1 className="text-md">Arrival Time: {bus.busArrival}</h1>
            </div>

            <hr />

            {/* SEAT DETAILS */}
            <div className="flex flex-col gap-2">
              <h1 className="text-md">Total Seats: {bus.busCapacity}</h1>

              <h1 className="text-md">
                Left Seats: {bus.busCapacity - bus.seatBooked.length}
              </h1>

              <h1 className="text-md">
                Selected Seats: {selectedSeats.join(", ")}
              </h1>

              <h1 className="text-md">
                Total Fare: ₹{selectedSeats.length * bus.busPrice}
              </h1>
            </div>

            <hr />

            {/* ====================================================== */}
            {/* BILLING DETAILS */}
            {/* ====================================================== */}
            <div className="flex flex-col gap-2">
              <h2>Billing Details</h2>

              <Input
                placeholder="Full Name"
                value={billingDetails.name}
                onChange={(e) =>
                  setBillingDetails({
                    ...billingDetails,
                    name: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Email"
                value={billingDetails.email}
                onChange={(e) =>
                  setBillingDetails({
                    ...billingDetails,
                    email: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Address Line"
                value={billingDetails.line1}
                onChange={(e) =>
                  setBillingDetails({
                    ...billingDetails,
                    line1: e.target.value,
                  })
                }
              />

              <Input
                placeholder="City"
                value={billingDetails.city}
                onChange={(e) =>
                  setBillingDetails({
                    ...billingDetails,
                    city: e.target.value,
                  })
                }
              />

              <Input
                placeholder="State"
                value={billingDetails.state}
                onChange={(e) =>
                  setBillingDetails({
                    ...billingDetails,
                    state: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Postal Code"
                value={billingDetails.postal_code}
                onChange={(e) =>
                  setBillingDetails({
                    ...billingDetails,
                    postal_code: e.target.value,
                  })
                }
              />
            </div>

            <hr />

            {/* ====================================================== */}
            {/* STRIPE PAYMENT ELEMENT */}
            {/* ====================================================== */}
            <PaymentElement />

            {/* ====================================================== */}
            {/* PAY BUTTON */}
            {/* ====================================================== */}
            <button className="btn btn-primary mt-3" onClick={handlePayment}>
              Pay ₹{selectedSeats.length * bus.busPrice}
            </button>
          </Col>

          {/* ====================================================== */}
          {/* RIGHT SECTION */}
          {/* ====================================================== */}
          <Col lg={12} sm={24} xs={24}>
            <SeatSelection
              bus={bus}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;
