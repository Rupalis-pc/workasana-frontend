import { Link } from "react-router-dom";

export default function Sidebar({ backToDashboard }) {
  if (backToDashboard) {
    return (
      <aside
        className="bg-dark text-white p-3 "
        style={{ minWidth: 220, minHeight: "100%" }}
      >
        <h2 className="logo mb-4">workasana</h2>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/dashboard" className="nav-link text-white">
              ← Back to Dashboard
            </Link>
          </li>
        </ul>
      </aside>
    );
  } else {
    return (
      <aside
        className="bg-dark text-white p-3 "
        style={{ minWidth: 220, minHeight: "100vh" }}
      >
        <h2 className="logo mb-4">workasana</h2>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/dashboard" className="nav-link text-white">
              📊 Dashboard
            </Link>
          </li>
          {/* <li className="nav-item mb-2">
            <Link to="/projects" className="nav-link text-white">
              📁 Project
            </Link>
          </li> */}
          <li className="nav-item mb-2">
            <Link to="/teams" className="nav-link text-white">
              👥 Team
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/reports" className="nav-link text-white">
              📑 Reports
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link text-white">
              ⚙️ Settings
            </Link>
          </li>
        </ul>
      </aside>
    );
  }
}
