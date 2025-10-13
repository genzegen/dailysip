// import { useState } from "react";
import Sidebar from "../components/Sidebar";
import '../styles/AdminPage.css';

export default function AdminPage() {

    return (
        <div className="admin-main">
            <div className="admin-sidebar">
                <Sidebar />
            </div>
            <div className="admin-content"></div>
        </div>
    );
}

