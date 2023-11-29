import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Protected(props) {
  const { Component } = props;
  const navigate = useNavigate();
  useEffect(() => {
    const login = localStorage.getItem("user-token");
    if (!login) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Component />
    </div>
  );
}
