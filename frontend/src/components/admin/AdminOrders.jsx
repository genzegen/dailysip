import React, { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8000/api/products/orders/", {
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
        console.error("Error fetching orders", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Admin Orders</h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        View and manage customer orders.
      </p>

      {loading && <p>Loading orders...</p>}
      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Total (Rs)</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Payment</th>
                <th style={thStyle}>Placed At</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                return (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td style={tdStyle}>#{order.id}</td>
                      <td style={tdStyle}>{order.user_username}</td>
                      <td style={tdStyle}>{Number(order.total_amount).toFixed(2)}</td>
                      <td style={tdStyle}>{order.status}</td>
                      <td style={tdStyle}>{order.payment_method}</td>
                      <td style={tdStyle}>
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => toggleExpand(order.id)}
                          style={{
                            padding: "0.25rem 0.6rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            background: "#f7f7f7",
                            cursor: "pointer",
                          }}
                        >
                          {isExpanded ? "Hide items" : "View items"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && order.items && order.items.length > 0 && (
                      <tr>
                        <td style={tdExpandedStyle} colSpan={7}>
                          <strong>Items:</strong>
                          <ul style={{ marginTop: "0.5rem" }}>
                            {order.items.map((item) => (
                              <li key={item.id}>
                                {item.product_name} x {item.quantity} — Rs. {Number(item.price).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                          {order.transaction_uuid && (
                            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
                              Txn UUID: {order.transaction_uuid}
                            </p>
                          )}
                          {order.esewa_ref_id && (
                            <p style={{ fontSize: "0.9rem", color: "#555" }}>
                              Ref ID: {order.esewa_ref_id}
                            </p>
                          )}
                          {order.delivery_location && (
                            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
                              Delivery location: {order.delivery_location}
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  padding: "0.5rem",
  background: "#f5f5f5",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "0.5rem",
  fontSize: "0.95rem",
};

const tdExpandedStyle = {
  borderBottom: "1px solid #eee",
  padding: "0.75rem 0.5rem",
  background: "#fafafa",
};
