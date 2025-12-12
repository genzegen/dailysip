import { useState } from "react";

export default function AdminSettings() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword1 !== newPassword2) {
            setError("New passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/accounts/change-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password1: newPassword1,
                    new_password2: newPassword2,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || "Failed to update password.");
            } else {
                setMessage(data.detail || "Password updated successfully.");
                setOldPassword("");
                setNewPassword1("");
                setNewPassword2("");
            }
        } catch (err) {
            console.error("Error updating password", err);
            setError("Error updating password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "400px" }}>
            <h1>Admin Settings</h1>
            <p>Change your admin password here.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "0.25rem" }}>Current Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.25rem" }}>New Password</label>
                    <input
                        type="password"
                        value={newPassword1}
                        onChange={(e) => setNewPassword1(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.25rem" }}>Confirm New Password</label>
                    <input
                        type="password"
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ padding: "0.6rem 1rem", marginTop: "0.5rem" }}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>

            {message && (
                <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>
            )}
            {error && (
                <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
            )}
        </div>
    );
}
