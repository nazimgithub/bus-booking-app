import React, { useState, useEffect, Children } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { showLoading, hideLoading } from "../redux/alertSlice";
import DefaultLayout from "./DefaultLayout";

function ProtectedRoute({ children }) {
  const { loading } = useSelector((state) => state.alerts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateToken = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/users/validate-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      dispatch(hideLoading());
      if (response.data.success) {
        dispatch(SetUser(response.data.data));
      } else {
        dispatch(hideLoading());
        localStorage.removeItem("token");
        message.error(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.removeItem("token");
      message.error(error.response?.data?.message || error.message);
      navigate("/login");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, []);
  return <div>{!loading && <DefaultLayout>{children}</DefaultLayout>}</div>;
}

export default ProtectedRoute;
