import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../helpers/axiosInstance";
import BookNow from "./BookNow";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function BookNowWrapper() {
  const [clientSecret, setClientSecret] = useState("");

  const getClientSecret = async () => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/booking/create-payment-intent",
        {
          amount: 1000,
          name: "Temp User",
          email: "temp@gmail.com",
        },
      );

      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClientSecret();
  }, []);

  return (
    <>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          <BookNow clientSecret={clientSecret} />
        </Elements>
      )}
    </>
  );
}

export default BookNowWrapper;
