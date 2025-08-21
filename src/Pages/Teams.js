import { useState, useEffect } from "react";
import Sidebar from "../Common/Sidebar";
import NewTeamModal from "./NewTeamModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Fetch teams from backend
  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/teams", {
        headers: { Authorization: token },
      });

      const data = await res.json();

      if (res.ok) {
        setTeams(data);
      } else {
        toast.error(data.message || "Failed to fetch teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="teams-screen d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar backToDashboard={true} />

      {/* Main */}
      <main className="main flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Teams</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowTeamModal(true)}
          >
            + New Team
          </button>
        </div>

        {/* Teams List */}
        <div className="row g-3">
          {teams.map((team) => (
            <div key={team._id} className="col-md-4">
              <div className="card shadow-sm p-3 h-100">
                {/* Team Name links to TeamDetails */}
                <h5 className="card-title fw-bold">
                  <Link
                    to={`/teams/${team._id}`}
                    className="text-decoration-none"
                  >
                    {team.name}
                  </Link>
                </h5>
                <p className="text-muted small mb-2">{team.description}</p>

                {/* Members */}
                <div className="d-flex mt-2 flex-wrap">
                  {team.members && team.members.length > 0 ? (
                    team.members.slice(0, 3).map((m, i) => {
                      const initials = m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase();
                      return (
                        <span
                          key={i}
                          className="badge rounded-circle bg-secondary me-2 d-flex align-items-center justify-content-center"
                          style={{ width: 30, height: 30 }}
                          title={m.name}
                        >
                          {initials}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-muted small">No members yet</span>
                  )}

                  {/* Show +X if more members */}
                  {team.members && team.members.length > 3 && (
                    <span className="badge bg-info">
                      +{team.members.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Team Modal */}
        <NewTeamModal
          show={showTeamModal}
          onHide={() => setShowTeamModal(false)}
          onCreate={() => {
            fetchTeams(); // refresh list after new team
            setShowTeamModal(false);
          }}
        />
      </main>
    </div>
  );
}
