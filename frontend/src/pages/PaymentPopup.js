import React, { useState } from "react";

export default function PaymentPopup({ onClose, onConfirm }) {
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleConfirm = () => {
    if (method === "card" && (!cardNumber || !cardName)) {
      alert("Please enter card details");
      return;
    }
    if (method === "upi" && !upiId) {
      alert("Please enter UPI ID");
      return;
    }

    const details =
      method === "card"
        ? { cardNumber, name: cardName }
        : { upiId };

    onConfirm(method, details);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>💎 Upgrade Plan</h2>

        <div style={styles.methodSelect}>
          <label>
            <input
              type="radio"
              value="card"
              checked={method === "card"}
              onChange={() => setMethod("card")}
            />
            💳 Card
          </label>
          <label>
            <input
              type="radio"
              value="upi"
              checked={method === "upi"}
              onChange={() => setMethod("upi")}
            />
            📱 UPI
          </label>
        </div>

        {method === "card" ? (
          <div style={styles.inputGroup}>
            <input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Name on Card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={styles.input}
            />
          </div>
        ) : (
          <input
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            style={styles.input}
          />
        )}

        <div style={styles.buttons}>
          <button onClick={handleConfirm} style={styles.payBtn}>
            Confirm Payment
          </button>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
