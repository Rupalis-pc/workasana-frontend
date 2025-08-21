import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NewMemberModal from "./NewMemberModal";
import Sidebar from "../Common/Sidebar";
import { toast } from "react-toastify";

export default function TeamDetails() {
  const { id } = useParams(); // get teamId from route (/teams/:id)
  const [team, setTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch team details
  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/teams/${id}`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) {
        setTeam(data);
      } else {
        toast.error(data.message || "Failed to fetch team");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  // Add new member to this team
  const handleAddMember = async (member) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/teams/${id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name: member.name }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Member added!");
        setTeam(data); // backend returns updated team
        setShowModal(false);
      } else {
        toast.error(data.message || "Failed to add member");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!team) return <p className="p-4">Loading...</p>;

  return (
    <div className="teams-screen d-flex">
      {/* Sidebar */}
      <Sidebar backToDashboard={true} />
      <div className="container py-4">
        {/* Back link */}
        <div className="mb-3">
          <Link to="/teams" className="text-decoration-none">
            ← Back to Teams
          </Link>
        </div>

        {/* Team name */}
        <h3 className="fw-bold">{team.name}</h3>
        <p className="text-muted">{team.description}</p>

        {/* Members */}
        <div className="mt-4">
          <h6 className="text-uppercase text-muted fw-bold">Members</h6>
          <ul className="list-unstyled mt-3">
            {team.members.map((member) => {
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <li key={member._id} className="d-flex align-items-center mb-3">
                  {/* Avatar circle */}
                  <div
                    className="rounded-circle bg-warning d-flex align-items-center justify-content-center me-3"
                    style={{ width: 40, height: 40 }}
                  >
                    <span className="fw-bold text-white">{initials}</span>
                  </div>
                  <span>{member.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Add Member Button */}
        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowModal(true)}
        >
          + Member
        </button>
        <NewMemberModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onCreate={handleAddMember}
        />
      </div>
    </div>
  );
}
