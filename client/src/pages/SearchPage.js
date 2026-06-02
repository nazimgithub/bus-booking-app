import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertSlice";
import { Row, Col, Card, Form, DatePicker, Button, Input, message } from "antd";
import "../resources/auth.css";
import axios from "axios";

function SearchPage() {
  const [buses, setBuses] = useState([]);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/buses/search-buses",
        values,
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.response?.data?.message || error.message);
    }
  };
  return (
    <div className="search-page">
      <div className="hero-section">
        <h1>Book Your Bus Journey</h1>
      </div>

      <Card className="search-card">
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="from" label="From">
                <Input type="text" placeholder="Enter Source" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="to" label="To">
                <Input type="text" placeholder="Enter Destination" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="date" label="Journey Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Button
                type="primary"
                htmlType="submit"
                className="primary-btn"
                block
              >
                Search Buses
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="Filters">{/* Filters */}</Card>
        </Col>

        <Col span={18}>
          {buses.length === 0 ? (
            <Card>
              <h3>No buses found</h3>
            </Card>
          ) : (
            buses.map((bus) => (
              <Card key={bus._id} className="bus-card">
                {/* Bus Details */}
                <Row align="middle">
                  <Col span={6}>
                    <h4>{bus.busName}</h4>
                    <p>{bus.busType}</p>
                  </Col>

                  <Col span={5}>
                    <h3>{bus.busDeparture}</h3>
                    <p>{bus.busForm}</p>
                  </Col>

                  <Col span={3}>
                    <h4>Direct</h4>
                  </Col>

                  <Col span={5}>
                    <h3>{bus.busArrival}</h3>
                    <p>{bus.busTo}</p>
                  </Col>

                  <Col span={3}>
                    <h3>₹{bus.busPrice}</h3>
                  </Col>

                  <Col span={2}>
                    <Button type="primary">Book</Button>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SearchPage;
