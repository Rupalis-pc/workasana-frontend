import { useState } from "react";
import Projects from "./Projects";
import Sidebar from "../Common/Sidebar";
import Tasks from "./Tasks";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="dashboard d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="main flex-grow-1 p-4 bg-light">
        {/* Header */}
        <header className="header d-flex align-items-center mb-4">
          <input
            type="text"
            className="form-control w-25 me-2"
            placeholder="Search by project/task name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        {/* Pass searchTerm to children */}
        <Projects searchTerm={searchTerm} />
        <Tasks searchTerm={searchTerm} />
      </main>
    </div>
  );
}
