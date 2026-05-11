import React from "react";
import { useNavigate } from "react-router-dom";

function Bus({ bus }) {
  const navigate = useNavigate();
  return (
    <div className="card p-2 mt-3">
      <h4>{bus.busName}</h4>
      <hr />
      <div className="d-flex justify-content-between">
        <div>
          <p>From:</p>
          <p>{bus.busForm}</p>
        </div>
        <div>
          <p>To:</p>
          <p>{bus.busTo}</p>
        </div>
        <div>
          <p>Fare:</p>
          <p>{bus.busPrice} /- Per Person</p>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <p>Journey Date:</p>
          <p>{bus.busJourney}</p>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate(`/book-now/${bus._id}`);
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bus;
