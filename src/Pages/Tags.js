import { useEffect, useState } from "react";

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const res = await fetch("http://localhost:4000/tags");
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create a new tag
  const createTag = async () => {
    try {
      const res = await fetch("http://localhost:4000/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error creating tag");
      }

      setNewTag("");
      setShowModal(false);
      setError("");
      fetchTags();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Tags</h4>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Tag
        </button>
      </div>

      {tags.length === 0 ? (
        <p>No tags available</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Tag Name</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, index) => (
              <tr key={tag._id}>
                <td>{index + 1}</td>
                <td>{tag.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Tag</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={createTag}
                  disabled={!newTag.trim()}
                >
                  Save Tag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
