import React, { useState } from "react";
import RoomList from "./RoomList";
import RoomForm from "./RoomForm";
import RoomAnalytics from "./RoomAnalytics";
import "./AdminPanel.css";

const AdminPanel = () => {
  // Check role from localStorage (set after login)
  const userRole = localStorage.getItem("role");

  // If user is not Admin, block access
  if (userRole !== "Admin") {
    return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>Access Denied: Admins Only</p>;
  }

  // Tabs state
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="admin-panel">
      <h2>Admin Panel – Room Management</h2>
      <div className="tabs">
        <button
          className={activeTab === "list" ? "active" : ""}
          onClick={() => setActiveTab("list")}
        >
          Room List
        </button>
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add Room
        </button>
        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "list" && <RoomList />}
        {activeTab === "add" && <RoomForm />}
        {activeTab === "analytics" && <RoomAnalytics />}
      </div>
    </div>
  );
};

export default AdminPanel;
