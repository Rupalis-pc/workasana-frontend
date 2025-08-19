import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewTaskModal({
  show,
  onHide,
  onCreate,
  projects = [],
  teams = [],
  users = [],
  tags = [],
}) {
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [owners, setOwners] = useState([]);
  const [taskTags, setTaskTags] = useState([]);
  const [due, setDue] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  if (!show) return null;

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          name,
          teamId,
          owners,
          tags: taskTags,
          due,
          estimatedTime,
          status: "In Progress",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Task created successfully!");
        onCreate(); // refresh tasks
        resetForm();
        onHide();
      } else {
        toast.error(data.message || "❌ Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("❌ Something went wrong");
    }
  };

  const resetForm = () => {
    setProjectId("");
    setName("");
    setTeamId("");
    setOwners([]);
    setTaskTags([]);
    setDue("");
    setEstimatedTime("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate();
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1060 }}
        aria-modal="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Create New Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onHide}
                ></button>
              </div>

              <div className="modal-body">
                {/* Project */}
                <div className="mb-3">
                  <label className="form-label">Select Project</label>
                  <select
                    className="form-select"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Name */}
                <div className="mb-3">
                  <label className="form-label">Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Team */}
                <div className="mb-3">
                  <label className="form-label">Select Team</label>
                  <select
                    className="form-select"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                  >
                    <option value="">-- Select Team --</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Owners */}
                <div className="mb-3">
                  <label className="form-label">Owners</label>
                  <select
                    multiple
                    className="form-select"
                    value={owners}
                    onChange={(e) =>
                      setOwners(
                        [...e.target.selectedOptions].map((o) => o.value)
                      )
                    }
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <select
                    multiple
                    className="form-select"
                    value={taskTags}
                    onChange={(e) =>
                      setTaskTags(
                        [...e.target.selectedOptions].map((o) => o.value)
                      )
                    }
                  >
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div className="mb-3">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    required
                  />
                </div>

                {/* Estimated Time */}
                <div className="mb-3">
                  <label className="form-label">Estimated Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
