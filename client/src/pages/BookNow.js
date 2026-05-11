import React, { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message, Row, Col } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { hideLoading, showLoading } from "../redux/alertSlice";
import SeatSelection from "../components/SeatSelection";
function BookNow() {
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  // const [SeatSelection, setSeatSelection] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const getBus = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post(
        "http://localhost:5000/api/buses/get-bus-by-id",
        {
          _id: params.id,
        },
      );
      dispatch(hideLoading());
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

  const bookNow = async () => {
    try {
      if (selectedSeats.length === 0) {
        return message.error("Please select at least one seat");
      }
      dispatch(showLoading());
      const response = await axiosInstance.post(
        "http://localhost:5000/api/booking/book-ticket",
        {
          bus: bus._id,
          seats: selectedSeats,
          user: "69e3c48fd0bfcbea986ef1d0",
        },
      );
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, []);

  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={20}>
          <Col lg={12} sm={24} xs={24}>
            <h1 className="text-lg text-secondary">
              <b>{bus.busName}</b>
            </h1>
            <h1 className="text-md">
              {bus.busForm} - {bus.busTo}
            </h1>
            <hr />
            <div className="flex flex-col gap-2">
              <h1 className="text-md">Journey Date: {bus.busJourney}</h1>
              <h1 className="text-md">Fare: {bus.busPrice} /-</h1>
              <h1 className="text-md">Departure Time: {bus.busDeparture}</h1>
              <h1 className="text-md">Arrival Time: {bus.busArrival}</h1>
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <h1 className="text-md">Total Seats: {bus.busCapacity}</h1>
              <h1 className="text-md">
                Left Seats: {bus.busCapacity - bus.seatBooked.length}
              </h1>
              <h1 className="text-md">
                Selected Seats: {selectedSeats.join(", ")}
              </h1>
              <h1 className="text-md">
                Fare: {selectedSeats.length * bus.busPrice} /-
              </h1>
              <button className="btn btn-primary" onClick={bookNow}>
                Book Now
              </button>
            </div>
          </Col>
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
