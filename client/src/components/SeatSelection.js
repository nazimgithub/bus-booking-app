import React from "react";
import { Row, Col } from "antd";
import "../resources/bus.css";
function SeatSelection({
  selectedSeats,
  setSelectedSeats,
  bus
}) {
  const capacity = bus.busCapacity;
  const selectOrunselectSeats = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  }
  return (
    <div>
      <div className="bus-container">
        <Row gutter={10, 10}>
          {Array.from(Array(capacity).keys()).map((seat) => {
            let seatClass = '';
            if(selectedSeats.includes(seat+1)){
              seatClass = 'selected-seat';
            }else if(bus.seatBooked.includes(seat+1)){
              seatClass = 'booked-seat';
            }
return (
              <Col key={seat} span={6}>
              <div className={`seat ${seatClass}`} onClick={()=>selectOrunselectSeats(seat+1)}><img src="/seater_available.svg" alt="Available Seat"   style={{
    height: "25px",
    width: "25px",
  }}/></div>
            </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default SeatSelection;
