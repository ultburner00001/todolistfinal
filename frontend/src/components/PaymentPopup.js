import React, { useState } from "react";

export default function PaymentPopup({ onClose, onSubmit }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCardChange = (f, v) => setCard((p) => ({ ...p, [f]: v }));

  const validateInputs = () => {
    if (paymentMethod === "card") {
      if (!/^\d{12,19}$/.test(card.number.replace(/\s+/g, ""))) return "Invalid card number";
      if (!card.name.trim()) return "Enter cardholder name";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return "Expiry must be MM/YY";
      if (!/^\d{3,4}$/.test(card.cvv)) return "Invalid CVV";
    } else {
      if (!upiId.includes("@")) return "Invalid UPI ID";
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validateInputs();
    if (err) return setMsg({ type: "error", text: err });

    setLoading(true);
    try {
      await onSubmit({
        method: paymentMethod,
        details: paymentMethod === "card" ? card : { upiId },
      });
      setMsg({ type: "success", text: "✅ Payment successful!" });
      setTimeout(onClose, 1200);
    } catch {
      setMsg({ type: "error", text: "Payment failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={popup.overlay}>
      <div style={popup.card}>
        <div style={popup.header}>
          <h3>💳 Upgrade to Premium</h3>
          <button style={popup.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={popup.methodRow}>
          <button
            onClick={() => setPaymentMethod("card")}
            style={{
              ...popup.methodBtn,
              background: paymentMethod === "card" ? "#4B7CFF33" : "transparent",
            }}
          >
            💳 Card
          </button>
          <button
            onClick={() => setPaymentMethod("upi")}
            style={{
              ...popup.methodBtn,
              background: paymentMethod === "upi" ? "#4B7CFF33" : "transparent",
            }}
          >
            📱 UPI
          </button>
        </div>

        {paymentMethod === "card" ? (
          <>
            <input
              style={popup.input}
              placeholder="Card Number"
              value={card.number}
              onChange={(e) => handleCardChange("number", e.target.value)}
            />
            <input
              style={popup.input}
              placeholder="Cardholder Name"
              value={card.name}
              onChange={(e) => handleCardChange("name", e.target.value)}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...popup.input, flex: 1 }}
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => handleCardChange("expiry", e.target.value)}
              />
              <input
                style={{ ...popup.input, width: 100 }}
                placeholder="CVV"
                value={card.cvv}
                onChange={(e) => handleCardChange("cvv", e.target.value)}
              />
            </div>
          </>
        ) : (
          <input
            style={popup.input}
            placeholder="UPI ID (e.g. name@bank)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        )}

        {msg && (
          <div
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 8,
              background: msg.type === "success"
                ? "rgba(72,187,120,0.1)"
                : "rgba(255,99,99,0.1)",
              color: msg.type === "success" ? "#48bb78" : "#ff6b6b",
            }}
          >
            {msg.text}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={handleSubmit} disabled={loading} style={popup.payBtn}>
            {loading ? "Processing..." : "Pay ₹99"}
          </button>
          <button onClick={onClose} style={popup.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const popup = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  card: {
    width: 360,
    background: "rgba(30, 30, 50, 0.95)",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
  },
  methodRow: { display: "flex", gap: 8, margin: "12px 0" },
  methodBtn: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    marginBottom: 8,
  },
  payBtn: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg,#4B7CFF,#8A2BE2)",
    color: "#fff",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent",
    color: "#ccc",
    cursor: "pointer",
  },
};
