import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Common/Sidebar";
import NewTaskModal from "./NewTaskModal";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  // Fetch project details
  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/project/${id}`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  // Fetch tasks for this project
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/tasks?project=${id}`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProject(), fetchTasks()]);
      setLoading(false);
    };
    loadData();
  }, [id]);

  // Sorting logic
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="dashboard d-flex">
        <Sidebar />
        <main className="main flex-grow-1 p-4 bg-light w-100">
          <p>Loading project...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main flex-grow-1 p-4 bg-light w-100">
        {/* Project Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">{project?.name}</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowTaskModal(true)}
          >
            + New Task
          </button>
        </div>
        <p className="text-muted">{project?.description}</p>

        {/* Filter + Sort Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="d-flex gap-2 flex-wrap">
            <button
              className={`btn btn-sm ${
                sortOrder === "newest"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setSortOrder("newest")}
            >
              Newest First
            </button>
            <button
              className={`btn btn-sm ${
                sortOrder === "oldest"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setSortOrder("oldest")}
            >
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
                <th>Owner(s)</th>
                <th>Due On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.length > 0 ? (
                sortedTasks.map((t) => (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td>
                      {t.owners && t.owners.length > 0
                        ? t.owners.map((o) => o.name).join(", ")
                        : "—"}
                    </td>
                    <td>
                      {t.createdAt && t.timeToComplete
                        ? new Date(
                            new Date(t.createdAt).getTime() +
                              t.timeToComplete * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()
                        : "No due date"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          t.status === "Completed"
                            ? "bg-success"
                            : t.status === "In Progress"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No tasks yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <NewTaskModal
          show={showTaskModal}
          onHide={() => setShowTaskModal(false)}
          onCreate={fetchTasks}
        />
      </main>
    </div>
  );
}
