import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { showLoading, hideLoading } from "../redux/alertSlice";
import { Col, Row, message } from "antd";
import Bus from "../components/Bus";

function Home() {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);

  const getBuses = () => {
    try {
      dispatch(showLoading());
      axiosInstance
        .post("http://localhost:5000/api/buses/get-all-buses", {})
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            setBuses(response.data.data);
          } else {
            message.error(response.data.message);
          }
        });
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBuses();
  }, []);

  return (
    <>
      <div></div>
      <div>
        <Row>
          {" "}
          {buses.map((bus) => (
            <Col key={bus._id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Bus bus={bus} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Home;
