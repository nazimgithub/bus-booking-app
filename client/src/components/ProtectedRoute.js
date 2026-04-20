import React, { useState, useEffect, Children } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const validateToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/validate-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
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
  return <div>{loading ? <div>Loading...</div> : <div>{children}</div>}</div>;
}

export default ProtectedRoute;
