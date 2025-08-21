import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./Pages/AuthForm";
import Dashboard from "./Pages/Dashboard";
import { AppProvider } from "./Context/useContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import ProjectDetail from "./Pages/ProjectDetail";
import Reports from "./Pages/Reports";
import Teams from "./Pages/Teams";
import TeamDetails from "./Pages/TeamDetails";
import Settings from "./Pages/Settings";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2000} />
    </AppProvider>
  );
}

export default App;
