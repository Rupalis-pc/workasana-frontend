import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewTeamModal({ show, onHide, onCreate }) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([""]);

  if (!show) return null;

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, ""]);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/teams", {
        method: "POST",
        body: JSON.stringify({ name: teamName, description, members }),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Team created successfully!");
        onCreate();

        setTeamName("");
        setDescription("");
        setMembers([""]);
        onHide();
      } else {
        toast.error(data.message || "Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Something went wrong");
    }
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
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Create New Team</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onHide}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Team Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter team details"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Add Members</label>
                  {members.map((member, index) => (
                    <div key={index} className="d-flex mb-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder={`Member ${index + 1}`}
                        value={member}
                        onChange={(e) =>
                          handleMemberChange(index, e.target.value)
                        }
                      />
                      {members.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRemoveMember(index)}
                        >
                          –
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={handleAddMember}
                  >
                    + Add Member
                  </button>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
