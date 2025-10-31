import React, { useEffect, useState } from "react";
import axiosInstance, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  // helper: extract userId from JWT token saved in localStorage
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      // decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split(".")[1]));
      // common keys: id or _id
      return payload.id || payload._id || null;
    } catch {
      return null;
    }
  };

  // ensure axios has auth header if token present
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token || null);

    const uid = getUserIdFromToken();
    if (!uid) {
      // not logged in — redirect to login
      // you can comment this out if you prefer to allow anonymous access
      navigate("/login");
      return;
    }

    fetchPayments(uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPayments = async (userId) => {
    try {
      const uid = userId || getUserIdFromToken();
      if (!uid) return;
      const res = await axiosInstance.get(`/api/payment/user/${uid}`);
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("You must be logged in to subscribe.");

      // Validate input
      if (method === "card") {
        if (!cardNumber || cardNumber.trim().length < 4) {
          throw new Error("Please enter a valid card number (mock).");
        }
      } else {
        if (!upiId || !upiId.includes("@")) {
          throw new Error("Please enter a valid UPI ID (e.g. me@upi).");
        }
      }

      const payload = {
        userId,
        method,
        amount: 499,
        details: method === "card"
          ? { cardNumber: cardNumber.replace(/\s+/g, ""), cardHolder }
          : { upiId },
      };

      const res = await axiosInstance.post("/api/payment/fake-pay", payload);

      if (res.data?.ok) {
        setMsg("✅ Payment simulated successfully — user flagged for premium.");
        // refresh payments
        await fetchPayments(userId);
        // optionally clear form fields
        setCardNumber("");
        setCardHolder("");
        setUpiId("");
      } else {
        setMsg(res.data?.error || "Payment simulation returned unexpected response.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setMsg(err.response?.data?.error || err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: 6 }}>Upgrade to Premium (Simulated)</h2>
        <p style={{ marginTop: 0, opacity: 0.9 }}>Choose Card or UPI — this is a fake gateway for demo.</p>

        <form onSubmit={submitPayment} style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={styles.radioLabel}>
              <input type="radio" name="method" value="card" checked={method === "card"} onChange={() => setMethod("card")} />
              <span style={{ marginLeft: 8 }}>Card</span>
            </label>
            <label style={{ ...styles.radioLabel, marginLeft: 16 }}>
              <input type="radio" name="method" value="upi" checked={method === "upi"} onChange={() => setMethod("upi")} />
              <span style={{ marginLeft: 8 }}>UPI</span>
            </label>
          </div>

          {method === "card" ? (
            <>
              <input
                placeholder="Card number (mock)"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={styles.input}
                required
              />
              <input
                placeholder="Card holder name (optional)"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                style={styles.input}
              />
            </>
          ) : (
            <input
              placeholder="UPI ID (e.g. your@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              style={styles.input}
              required
            />
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="submit" disabled={loading} style={styles.payBtn}>
              {loading ? "Processing..." : "Pay ₹499 (Fake)"}
            </button>
            <button type="button" onClick={() => { setCardNumber(""); setCardHolder(""); setUpiId(""); setMsg(""); }} style={styles.cancelBtn}>
              Reset
            </button>
          </div>
        </form>

        {msg && <div style={styles.message}>{msg}</div>}
      </div>

      <div style={{ ...styles.card, marginTop: 18 }}>
        <h3 style={{ marginBottom: 8 }}>Payment History (simulated)</h3>
        {payments.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No payments yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {payments.map((p) => (
              <div key={p._id} style={styles.paymentRow}>
                <div>
                  <strong>{p.method.toUpperCase()}</strong> — {p.status}
                  <div style={{ fontSize: 12, opacity: 0.8 }}>₹{p.amount} • {new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85 }}>
                  {p.details?.last4 ? `•••• ${p.details.last4}` : p.details?.upiId || ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 820, margin: "24px auto", padding: 16 },
  card: { background: "rgba(255,255,255,0.03)", padding: 18, borderRadius: 10, color: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" },
  input: { width: "100%", padding: 10, borderRadius: 8, marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "#fff" },
  radioLabel: { display: "inline-flex", alignItems: "center", cursor: "pointer" },
  payBtn: { background: "#4B7CFF", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer" },
  cancelBtn: { background: "#eee", color: "#333", border: "none", padding: "10px 12px", borderRadius: 8, cursor: "pointer" },
  message: { marginTop: 12, padding: 10, background: "rgba(0,0,0,0.35)", borderRadius: 8 },
  paymentRow: { display: "flex", justifyContent: "space-between", padding: 10, borderRadius: 6, background: "rgba(255,255,255,0.02)" },
};
