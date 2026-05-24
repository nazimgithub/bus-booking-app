import React, { useEffect, useState, useRef } from "react";
import { message, Modal, Table } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { axiosInstance } from "../helpers/axiosInstance";
import PageTitle from "../components/PageTitle";
import { useReactToPrint } from "react-to-print";

function Booking() {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem("userId");
  const [showPrintModel, setShowPrintModel] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const getBookings = () => {
    try {
      dispatch(showLoading());
      axiosInstance
        .post("http://localhost:5000/api/booking/get-bookings-by-user-id", {
          user: userId,
        })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            console.log(response.data.data);
            const mappedData = response.data.data.map((booking) => ({
              key: booking._id,
              busName: booking.bus.busName,
              busNumber: booking.bus.busNumber,
              busForm: booking.bus.busForm,
              busTo: booking.bus.busTo,
              busJourney: booking.bus.busJourney,
              departureTime: booking.bus.busDeparture,
              seats: booking.seats,
              amount: booking.bus.busPrice,
            }));
            console.log(mappedData);
            setBookings(mappedData);
          } else {
            message.error(response.data.message);
          }
        });
    } catch (error) {}
  };
  useEffect(() => {
    getBookings();
  }, []);

  // Print ticket model
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef,
  });

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "busName",
      key: "bus",
      render: (busName) => busName,
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
      key: "bus",
    },
    {
      title: "From",
      dataIndex: "busForm",
    },
    {
      title: "To",
      dataIndex: "busTo",
    },
    {
      title: "Journey Date",
      dataIndex: "busJourney",
      render: (busJourney) => moment(busJourney).format("DD-MM-YYYY"),
    },
    {
      title: "Journey Time",
      dataIndex: "departureTime",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => seats.join(", "),
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModel(true);
            }}
          >
            Print Ticket
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageTitle title="Bookings" />
      <Table columns={columns} dataSource={bookings} />
      {showPrintModel && (
        <Modal
          title="Print Ticket"
          open={showPrintModel}
          onOk={handlePrint}
          okText="Print"
          onCancel={() => {
            setShowPrintModel(false);
            setSelectedBooking(null);
          }}
        >
          <div className="d-flex flex-column p-3" ref={contentRef}>
            <h3 className="text-lg">{selectedBooking.busName}</h3>
            <hr />
            <h3 className="text-md text-secondary">
              Bus Number : {selectedBooking.busNumber}
            </h3>
            <h3 className="text-md text-secondary">
              {selectedBooking.busForm} - {selectedBooking.busTo}
            </h3>
            <p className="text-secondary">
              Date of Journey :
              {moment(selectedBooking.busJourney).format("DD-MM-YYYY")}
            </p>
            <p className="text-secondary">
              Departure Time : {selectedBooking.departureTime}
            </p>
            <hr />
            <p className="text-secondary">
              Seats : {selectedBooking.seats.join(", ")}
            </p>
            <p className="text-secondary">
              Fare Amount : {selectedBooking.amount} /-
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Booking;
