import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { axiosInstance } from "../helpers/axiosInstance";
import PageTitle from "../components/PageTitle";

function Booking() {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem("userId");
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
            setBookings(response.data.data);
          } else {
            message.error(response.data.message);
          }
        });
    } catch (error) {}
  };
  useEffect(() => {
    getBookings();
  }, []);

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
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
  ];

  return (
    <>
      <PageTitle title="Bookings" />
      <Table columns={columns} dataSource={bookings} />
    </>
  );
}

export default Booking;
