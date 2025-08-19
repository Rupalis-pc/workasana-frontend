import { useState } from "react";
import Projects from "./Projects";
import Sidebar from "../Common/Sidebar";
import NewTaskModal from "./NewTaskModal";

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Create filter feature",
      status: "In Progress",
      due: "20th Dec 2024",
      owner: "Ujjwal Tandon",
    },
    {
      id: 2,
      name: "Fix login bug",
      status: "Completed",
      due: "18th Dec 2024",
      owner: "Aarti",
    },
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:4000/tasks");
    const data = await res.json();
    setTasks(data);
  };

  return (
    <div className="dashboard d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="main flex-grow-1 p-4 bg-light">
        {/* Header */}
        <header className="header d-flex align-items-center mb-4">
          <input
            type="text"
            className="form-control w-25 me-2"
            placeholder="Search..."
          />
        </header>

        <Projects />
        {/* Tasks */}
        <section className="section">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">My Tasks</h3>
            <button
              className="btn btn-success"
              onClick={() => setShowTaskModal(true)}
            >
              + New Task
            </button>
          </div>
          <div className="row g-3">
            {tasks.map((t) => (
              <div key={t.id} className="col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <span
                      className={`badge bg-${
                        t.status === "Completed" ? "success" : "warning"
                      } text-uppercase mb-2`}
                    >
                      {t.status}
                    </span>
                    <h4 className="card-title">{t.name}</h4>
                    <p className="card-text mb-1">Due: {t.due}</p>
                    <small className="text-muted">Owner: {t.owner}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Task Modal */}
        <NewTaskModal
          show={showTaskModal}
          onHide={() => setShowTaskModal(false)}
          onCreate={fetchTasks}
        />
      </main>
    </div>
  );
}
