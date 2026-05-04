import React, { useEffect, useState } from "react";
import BusForm from "../../components/BusForm";
import PageTitle from "../../components/PageTitle";
import { showLoading, hideLoading } from "../../redux/alertSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import moment from "moment";

function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  const getBuses = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post(
        "http://localhost:5000/api/buses/get-all-buses",
        {},
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "busName",
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
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
      title: "Bus Type",
      dataIndex: "busType",
    },
    {
      title: "Capacity",
      dataIndex: "busCapacity",
    },
    {
      title: "Price",
      dataIndex: "busPrice",
    },
    {
      title: "Journey Date",
      dataIndex: "busJourney",
      render: (busJourney) => moment(busJourney).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedBus(record);
              setShowBusForm(true);
            }}
          ></i>
          <i className="ri-delete-bin-line"></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBuses();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mt-3">
        <PageTitle title="Buses" />
        <button
          className="btn btn-primary"
          onClick={() => setShowBusForm(true)}
        >
          Add Bus
        </button>
      </div>

      <Table columns={columns} dataSource={buses} />
      {showBusForm && (
        <BusForm
          showBusForm={showBusForm}
          setShowBusForm={setShowBusForm}
          type={selectedBus ? "update" : "add"}
          selectedBus={selectedBus}
          setSelectedBus={setSelectedBus}
          getData={getBuses}
        />
      )}
    </div>
  );
}

export default AdminBuses;
