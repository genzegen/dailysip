import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				setError(null);

				const res = await fetch("http://localhost:8000/api/products/dashboard/", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				if (!res.ok) {
					const data = await res.json().catch(() => ({}));
					throw new Error(data.detail || "Failed to load dashboard stats");
				}

				const data = await res.json();
				setStats(data);
			} catch (err) {
				console.error("Error fetching dashboard stats", err);
				setError(err.message || "Something went wrong");
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	return (
		<div style={{ padding: "1.5rem" }}>
			<h1 style={{ marginBottom: "1rem" }}>Admin Dashboard</h1>
			<p style={{ marginBottom: "1.5rem", color: "#555" }}>
				Overview of sales and products.
			</p>

			{loading && <p>Loading dashboard...</p>}
			{error && (
				<p style={{ color: "red", marginBottom: "1rem" }}>
					{error}
				</p>
			)}

			{!loading && !error && stats && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
						gap: "1rem",
					}}
				>
					<StatCard
						title="Total Orders"
						value={stats.total_orders}
					/>
					<StatCard
						title="Total Revenue (Rs)"
						value={stats.total_revenue.toFixed(2)}
					/>
					<StatCard
						title="Orders Today"
						value={stats.today_orders}
					/>
					<StatCard
						title="Products"
						value={stats.total_products}
						subtitle={`Low stock: ${stats.low_stock_products}, Out of stock: ${stats.out_of_stock_products}`}
					/>
				</div>
			)}
		</div>
	);
}

function StatCard({ title, value, subtitle }) {
	return (
		<div
			style={{
				border: "1px solid #e0e0e0",
				borderRadius: "8px",
				padding: "1rem",
				background: "#fff",
				boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
			}}
		>
			<h2 style={{ fontSize: "0.95rem", marginBottom: "0.5rem", color: "#666" }}>{title}</h2>
			<div style={{ fontSize: "1.4rem", fontWeight: 600 }}>{value}</div>
			{subtitle && (
				<p style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: "#777" }}>{subtitle}</p>
			)}
		</div>
	);
}