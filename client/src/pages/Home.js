import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { showLoading, hideLoading } from "../redux/alertSlice";
import { Col, Row, message, input, Button } from "antd";
import Bus from "../components/Bus";

function Home() {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [filters = {}, setFilters] = useState({});

  const getBuses = () => {
    const tempFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        tempFilters[key] = filters[key];
      }
    });
    try {
      dispatch(showLoading());
      axiosInstance
        .post("http://localhost:5000/api/buses/get-all-buses", tempFilters)
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
      <div className="my-3 card px-2 py-3">
        <Row gutter={10} align="center">
          <Col lg={6} sm={24}>
            <input
              type="text"
              placeholder="From"
              value={filters.busForm}
              onChange={(e) =>
                setFilters({ ...filters, busForm: e.target.value })
              }
            />
          </Col>
          <Col lg={6} sm={24}>
            <input
              type="text"
              placeholder="To"
              value={filters.busTo}
              onChange={(e) =>
                setFilters({ ...filters, busTo: e.target.value })
              }
            />
          </Col>
          <Col lg={6} sm={24}>
            <input
              type="date"
              placeholder="Jounary Date"
              value={filters.busJourney}
              onChange={(e) =>
                setFilters({ ...filters, busJourney: e.target.value })
              }
            />
          </Col>
          <Col lg={6} sm={24}>
            <div className="d-flex gap-2">
              <button className="btn btn-danger" onClick={() => getBuses()}>
                Search
              </button>
              <button
                className="btn btn-primary"
                onClick={() =>
                  setFilters({
                    busForm: "",
                    busTo: "",
                    busJourney: "",
                  })
                }
              >
                Clear
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={[15, 15]}>
          {buses
            .filter((bus) => bus.status === "Yet to Start")
            .map((bus) => (
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
