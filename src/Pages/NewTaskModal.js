import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../useFetch";

export default function NewTaskModal({ show, onHide, onCreate }) {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("To Do");

  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [owners, setOwners] = useState([]);
  const [taskTags, setTaskTags] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState("");

  useEffect(() => {
    if (show) {
      fetchProjects();
      fetchTeams();
      fetchTags();
      fetchUsers();
    }
  }, [show]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to load projects");
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://workasana-backend-three.vercel.app/teams",
        {
          headers: { Authorization: token },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error("Error fetching teams:", err);
      toast.error("Failed to load teams");
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(
        "https://workasana-backend-three.vercel.app/tags"
      );
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error("Error fetching tags:", err);
      toast.error("Failed to load tags");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://workasana-backend-three.vercel.app/users"
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
    }
  };

  if (!show) return null;

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://workasana-backend-three.vercel.app/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            name,
            project: projectId,
            team: teamId,
            owners,
            tags: taskTags,
            timeToComplete: parseInt(estimatedTime, 10),
            status,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Task created successfully!");
        onCreate();
        resetForm();
        onHide();
      } else {
        toast.error(data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setProjectId("");
    setName("");
    setTeamId("");
    setOwners([]);
    setTaskTags([]);
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
                  <label className="form-label">Select Project *</label>
                  <select
                    className="form-select"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Project --</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Name */}
                <div className="mb-3">
                  <label className="form-label">Task Name *</label>
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
                  <label className="form-label">Select Team *</label>
                  <select
                    className="form-select"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Team --</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                {/* Owners (React Select Multi) */}
                <div className="mb-3">
                  <label className="form-label">Owners *</label>
                  <Select
                    isMulti
                    options={users.map((u) => ({
                      value: u._id,
                      label: u.name,
                    }))}
                    value={owners
                      .map((id) => {
                        const user = users.find((u) => u._id === id);
                        return user
                          ? { value: user._id, label: user.name }
                          : null;
                      })
                      .filter(Boolean)}
                    onChange={(selected) =>
                      setOwners(selected ? selected.map((s) => s.value) : [])
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select owners..."
                  />
                </div>

                {/* Tags (React Select Multi) */}
                <div className="mb-3">
                  <label className="form-label">Tags *</label>
                  <Select
                    isMulti
                    options={tags.map((tag) => ({
                      value: tag.name, // send tag.name, not tag._id
                      label: tag.name,
                    }))}
                    value={taskTags.map((name) => ({
                      value: name,
                      label: name,
                    }))} // store string names
                    onChange={(selected) =>
                      setTaskTags(selected ? selected.map((s) => s.value) : [])
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select tags..."
                  />
                </div>

                {/* Estimated Time */}
                <div className="mb-3">
                  <label className="form-label">Estimated Time (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    required
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
