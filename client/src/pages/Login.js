import React from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        values,
      );
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem("token", JSON.stringify(response.data.data));
        navigate("/");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center">
      <div className="w-400 card p-3">
        <h3 className="text-center text-lg">BookBus - Login</h3>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email">
            <input type="email" />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/register">Click here to Register</Link>
            <button className="primary-btn" type="submit">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
