import React from "react";
import { message, Modal, Form, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { showLoading, hideLoading } from "../redux/alertSlice";
import moment from "moment";

function BusForm({
  showBusForm,
  setShowBusForm,
  type = "add",
  getData,
  selectedBus,
  setSelectedBus,
}) {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      let response = null;

      if (type === "add") {
        response = await axiosInstance.post(
          "http://localhost:5000/api/buses/add-bus",
          {
            ...values,
            busJourney: moment(values.busJourney).format("YYYY-MM-DD"),
          },
        );
      } else {
        response = await axiosInstance.put(
          `http://localhost:5000/api/buses/update-bus`,
          {
            ...values,
            _id: values._id,
            busJourney: moment(values.busJourney).format("YYYY-MM-DD"),
          },
        );
      }

      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowBusForm(false);
      setSelectedBus(null);
      dispatch(hideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(hideLoading());
    }
  };
  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Bus" : "Update Bus"}
      open={showBusForm}
      onCancel={() => {
        setSelectedBus(null);
        setShowBusForm(false);
      }}
      footer={false}
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ...selectedBus,
          busJourney: moment(selectedBus?.busJourney).toDate(),
        }}
      >
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item name="busNumber" label="Bus Number">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="busName" label="Bus Name">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="busCapacity" label="Capacity">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="busForm" label="Form">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="busTo" label="To">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="busJourney" label="Journey Date">
              <input type="date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="busDeparture" label="Departure">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="busArrival" label="Arrival">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="busType" label="Type">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="busPrice" label="Ticket Price">
              <input type="text" />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default BusForm;
