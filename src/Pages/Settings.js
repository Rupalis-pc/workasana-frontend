import { useState } from "react";
import Tags from "./Tags";
import Sidebar from "../Common/Sidebar";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("tags");

  return (
    <div className="teams-screen d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar backToDashboard={true} />
      <div className="container mt-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "tags" ? "active" : ""}`}
              onClick={() => setActiveTab("tags")}
            >
              Tags
            </button>
          </li>
        </ul>

        <div className="mt-3">
          {activeTab === "tags" && <Tags />}
          {activeTab === "projects" && (
            <div>
              <h4>Projects</h4>
              <p>Project settings go here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
