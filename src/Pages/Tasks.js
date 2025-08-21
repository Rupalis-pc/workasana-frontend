import { useEffect, useState } from "react";
import NewTaskModal from "./NewTaskModal";
import { API_URL } from "../useFetch";

const Tasks = ({ searchTerm }) => {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.project?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
          {filteredTasks.map((t) => (
            <div key={t._id} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {/* Status */}
                  <span
                    className={`badge bg-${
                      t.status === "Completed"
                        ? "success"
                        : t.status === "In Progress"
                        ? "warning"
                        : t.status === "Blocked"
                        ? "danger"
                        : "secondary"
                    } text-uppercase mb-2`}
                  >
                    {t.status}
                  </span>

                  {/* Task name */}
                  <h4 className="card-title">{t.name}</h4>

                  {/* Project & Team */}
                  <p className="mb-1">
                    <strong>Project:</strong> {t.project?.name || "No Project"}
                  </p>
                  <p className="mb-1">
                    <strong>Team:</strong> {t.team?.name || "No Team"}
                  </p>

                  {/* Owners */}
                  <p className="mb-1">
                    <strong>Owners:</strong>{" "}
                    {t.owners && t.owners.length > 0
                      ? t.owners.map((o) => o.name).join(", ")
                      : "No Owners"}
                  </p>

                  {/* Tags */}
                  {t.tags && t.tags.length > 0 && (
                    <div className="mb-1">
                      <strong>Tags: </strong>
                      {t.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="badge bg-info text-dark me-1"
                        >
                          {typeof tag === "string" ? tag : tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Time to complete */}
                  <small className="text-muted">
                    Est. Time: {t.timeToComplete} days
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NewTaskModal
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        onCreate={fetchTasks}
      />
    </>
  );
};

export default Tasks;
