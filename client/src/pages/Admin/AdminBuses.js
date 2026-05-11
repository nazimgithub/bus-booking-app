import React, { useEffect, useState } from "react";
import BusForm from "../../components/BusForm";
import PageTitle from "../../components/PageTitle";
import { showLoading, hideLoading } from "../../redux/alertSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table, Popconfirm } from "antd";
import moment from "moment";
import toast from "react-hot-toast";

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

  const deleteBus = async (id) => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post(
        `http://localhost:5000/api/buses/delete-bus`,
        {
          _id: id,
        },
      );
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {}
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
          <Popconfirm
            title="Update Bus"
            description="Are you sure to update details?"
            onConfirm={() => {
              setSelectedBus(record);
              setShowBusForm(true);
            }}
            okText="Yes"
            cancelText="No"
          >
            <i className="ri-pencil-line cursor-pointer"></i>
          </Popconfirm>
          <Popconfirm
            title="Delete Bus"
            description="Are you sure to delete this bus?"
            onConfirm={() => deleteBus(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <i className="ri-delete-bin-line cursor-pointer"></i>
          </Popconfirm>
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
