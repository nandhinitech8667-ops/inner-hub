import React from "react";
import { useLocation } from "react-router-dom";

const steps = ["placed", "packed", "shipped", "delivered"];

const TrackOrder = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <h3>No order found</h3>;

  const currentStep = steps.indexOf(order.status);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Track Order</h2>

      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {order.status}</p>

      <div style={styles.timeline}>
        {steps.map((step, index) => (
          <div key={step} style={styles.step}>
            <div
              style={{
                ...styles.circle,
                background: index <= currentStep ? "green" : "#ccc",
              }}
            />
            <p>{step.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  timeline: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },
  step: {
    textAlign: "center",
    flex: 1,
  },
  circle: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    margin: "auto",
  },
};

export default TrackOrder;