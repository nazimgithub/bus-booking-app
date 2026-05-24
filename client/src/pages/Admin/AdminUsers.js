import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { showLoading, hideLoading } from "../../redux/alertSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table, Popconfirm } from "antd";
import toast from "react-hot-toast";

function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post(
        "http://localhost:5000/api/users/get-all-users",
        {},
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const changeUserStatus = async (id) => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post(
        `http://localhost:5000/api/users/change-status`,
        {
          _id: id,
        },
      );
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        setUsers();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {}
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact No.",
      dataIndex: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <Popconfirm
            title="Update User"
            description="Are you sure to update details?"
            onConfirm={() => {
              setUsers(record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <i className="ri-pencil-line cursor-pointer"></i>
          </Popconfirm>
          <Popconfirm
            title="Delete Bus"
            description="Are you sure to update user status?"
            onConfirm={() => changeUserStatus(record._id)}
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
    getUsers();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mt-3">
        <PageTitle title="Users" />
      </div>

      <Table columns={columns} dataSource={users} />
    </div>
  );
}

export default AdminUsers;
