import { useState } from "react";
import Sidebar from "../Common/Sidebar";

export default function ProjectDetail() {
  const [tasks] = useState([
    {
      id: 1,
      name: "Create Filter feature",
      owner: "Ujjwal Tandon",
      priority: "High",
      due: "20 Dec, 2024",
      status: "In Progress",
    },
    {
      id: 2,
      name: "Fix Login Bug",
      owner: "Aarti",
      priority: "Low",
      due: "18 Dec, 2024",
      status: "Completed",
    },
    {
      id: 3,
      name: "UI Polish",
      owner: "Rahul",
      priority: "Medium",
      due: "22 Dec, 2024",
      status: "In Progress",
    },
  ]);

  return (
    <div className="dashboard d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main flex-grow-1 p-4 bg-light w-100">
        {/* Project Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">Create Moodboard</h3>
          <button className="btn btn-primary">+ New Task</button>
        </div>
        <p className="text-muted">
          This project contains tasks around compiling a digital moodboard to
          set the visual direction and tone for a new brand identity. The
          moodboard will showcase curated images, colors, typography, and layout
          inspirations.
        </p>

        {/* Filter + Sort Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-outline-secondary btn-sm">
              Priority Low→High
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              Priority High→Low
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              Newest First
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              Oldest First
            </button>
          </div>
          <div>
            <select className="form-select form-select-sm">
              <option>Filter</option>
              <option>By Owner</option>
              <option>By Tag</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped align-middle w-100">
            <thead className="table-light">
              <tr>
                <th>Tasks</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Due On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.owner}</td>
                  <td>
                    <span
                      className={`badge ${
                        t.priority === "High"
                          ? "bg-danger"
                          : t.priority === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td>{t.due}</td>
                  <td>
                    <span
                      className={`badge ${
                        t.status === "Completed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
