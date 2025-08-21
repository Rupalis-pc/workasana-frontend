import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Common/Sidebar";
import NewTaskModal from "./NewTaskModal";
import { API_URL } from "../useFetch";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  // new filter states
  const [ownerFilter, setOwnerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch project details
  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/projects/${id}`, {
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
      const res = await fetch(`${API_URL}/tasks/projects=${id}`, {
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

  // Apply filters
  const filteredTasks = sortedTasks.filter((t) => {
    const ownerMatch =
      !ownerFilter ||
      (t.owners && t.owners.some((o) => o.name === ownerFilter));
    const statusMatch = !statusFilter || t.status === statusFilter;

    return ownerMatch && statusMatch;
  });

  // Get unique owners and statuses
  const uniqueOwners = Array.from(
    new Set(tasks.flatMap((t) => (t.owners ? t.owners.map((o) => o.name) : [])))
  );
  const uniqueStatuses = Array.from(new Set(tasks.map((t) => t.status)));

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
          {/* Sort Buttons */}
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

          {/* Filters */}
          <div className="d-flex gap-2">
            {/* Owner Filter */}
            <select
              className="form-select form-select-sm"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option value="">All Owners</option>
              {uniqueOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
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
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => (
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
                    No tasks found
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
