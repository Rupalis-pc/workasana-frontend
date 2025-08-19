import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

export default useAppContext;

export function AppProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);

  // fetch all projects
  async function fetchProjects() {
    try {
      const res = await fetch("http://localhost:4000/projects");
      const data = await res.json();
      if (res.ok) {
        setProjects(data); // assuming backend returns array
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  // on mount, load projects
  useEffect(() => {
    fetchProjects();
  }, []);

  // after create, just refetch from backend
  function handleCreateProject() {
    fetchProjects();
  }

  return (
    <AppContext.Provider
      value={{ showModal, setShowModal, handleCreateProject, projects }}
    >
      {children}
    </AppContext.Provider>
  );
}
