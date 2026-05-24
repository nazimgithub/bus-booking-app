import React from "react";
import { message, Modal, Form, Row, Col, Select } from "antd";
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
  const [form] = Form.useForm();

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
            _id: selectedBus._id,
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
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ...selectedBus,
          busJourney: moment(selectedBus?.busJourney).format("YYYY-MM-DD"),
        }}
      >
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item
              name="busNumber"
              label="Bus Number"
              rules={[
                {
                  required: true,
                  message: "Please enter bus number",
                },
              ]}
            >
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="busName"
              label="Bus Name"
              rules={[
                {
                  required: true,
                  message: "Please enter bus name",
                },
              ]}
            >
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="busCapacity"
              label="Capacity"
              rules={[
                {
                  required: true,
                  message: "Please enter total capacity",
                },
              ]}
            >
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="busForm"
              label="Form"
              rules={[
                {
                  required: true,
                  message: "Please enter source name",
                },
              ]}
            >
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="busTo"
              label="To"
              rules={[
                {
                  required: true,
                  message: "Please enter destination name",
                },
              ]}
            >
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="busJourney"
              label="Journey Date"
              rules={[
                {
                  required: true,
                  message: "Select Journey Date",
                },
              ]}
            >
              <input type="date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="busDeparture"
              label="Departure"
              rules={[
                {
                  required: true,
                  message: "Please enter time of departure",
                },
              ]}
            >
              <input type="time" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="busArrival"
              label="Arrival"
              rules={[
                {
                  required: true,
                  message: "Please enter tentative arrival time",
                },
              ]}
            >
              <input type="time" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Type"
              name="busType"
              rules={[
                {
                  required: true,
                  message: "Please select bus type",
                },
              ]}
            >
              <Select>
                <Select.Option value="">-- Select Bus Type --</Select.Option>
                <Select.Option value="AC">AC</Select.Option>
                <Select.Option value="Non-AC">Non-AC</Select.Option>
                <Select.Option value="Delux">Delux</Select.Option>
                <Select.Option value="Super Delux">Super Delux</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="busPrice"
              label="Ticket Price"
              rules={[
                {
                  required: true,
                  message: "Please enter ticket price",
                },
                {
                  validator: (_, value) => {
                    if (!value || Number(value) > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Amount must be greater than zero"),
                    );
                  },
                },
              ]}
            >
              <input type="text" min="1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="Yet to Start">Yet to Start</Select.Option>

                <Select.Option value="Running">Running</Select.Option>

                <Select.Option value="Completed">Completed</Select.Option>
              </Select>
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
