import React, { useEffect, useState } from "react";
import Header from "../components/Header";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8000/api/products/my-orders/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || "Failed to load orders");
        }

        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching user orders", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // SEO: page title for order history
  useEffect(() => {
    document.title = 'My Orders – dailySips';
  }, []);

  return (
    <div>
      <Header />
      <div style={{ marginTop: "12vh", padding: "2rem", minHeight: "88vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>My Orders</h1>
          <p style={{ marginBottom: "1.5rem", color: "#555" }}>
            Track your recent purchases, payment status, and delivery details.
          </p>

          {/* Simple summary placeholders */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <SummaryCard label="Total Orders" value={orders.length} />
            <SummaryCard
              label="Completed"
              value={orders.filter((o) => o.status === "COMPLETE").length}
            />
            <SummaryCard
              label="Pending"
              value={orders.filter((o) => o.status !== "COMPLETE").length}
            />
          </div>

          {loading && <p>Loading orders...</p>}
          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}

          {!loading && !error && orders.length === 0 && (
            <div
              style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h2 style={{ marginBottom: "0.5rem" }}>No orders yet</h2>
              <p style={{ marginBottom: "1rem", color: "#666" }}>
                When you place an order, it will appear here with status and details.
              </p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div
              style={{
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>Order</th>
                      <th style={thStyle}>Total (Rs)</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Payment</th>
                      <th style={thStyle}>Placed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td style={tdStyle}>#{order.id}</td>
                        <td style={tdStyle}>{Number(order.total_amount).toFixed(2)}</td>
                        <td style={tdStyle}>{order.status}</td>
                        <td style={tdStyle}>{order.payment_method}</td>
                        <td style={tdStyle}>
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        flex: "1 1 160px",
        minWidth: "160px",
        background: "#fff",
        borderRadius: "8px",
        padding: "1rem 1.2rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.9rem", color: "#777" }}>{label}</p>
      <p style={{ margin: 0, marginTop: "0.3rem", fontSize: "1.4rem", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #ddd",
  padding: "0.6rem",
  textAlign: "left",
  backgroundColor: "#fafafa",
  fontSize: "0.9rem",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "0.6rem",
  fontSize: "0.9rem",
};
