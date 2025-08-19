import NewProjectModal from "./NewProjectModal";
import useAppContext from "../Context/useContext";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const { projects, showModal, setShowModal, handleCreateProject, loading } =
    useAppContext();

  const navigate = useNavigate();

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <>
      <section className="section mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Projects</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + New Project
          </button>
        </div>
        <div className="row g-3">
          {projects.map((p) => (
            <div key={p._id} className="col-md-4">
              <div
                className="card shadow-sm h-100"
                onClick={() => navigate(`/ProjectDetail/${p._id}`)}
              >
                <div className="card-body">
                  {/* <span
                    className={`badge bg-${
                      p.status === "Completed" ? "success" : "warning"
                    } text-uppercase mb-2`}
                  >
                    {p.status}
                  </span> */}
                  <h4 className="card-title">{p.name}</h4>
                  <p className="card-text">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NewProjectModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
}
