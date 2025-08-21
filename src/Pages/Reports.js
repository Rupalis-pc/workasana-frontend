import { useState, useEffect } from "react";
import Sidebar from "../Common/Sidebar";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Reports() {
  const [reportData, setReportData] = useState({
    workDone: [], // [completed, pending]
    tasksByTeam: {},
    tasksByOwner: {},
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // 1. Total Work Done
        const workRes = await fetch(
          "http://localhost:4000/report/total-work-done"
        );
        const workData = await workRes.json();

        let completed = 0;
        let pending = 0;

        workData.forEach((w) => {
          if (w._id === "Completed") {
            completed = w.count;
          } else {
            pending += w.count;
          }
        });

        // 2. Closed tasks by team
        const teamRes = await fetch(
          "http://localhost:4000/report/closed-tasks-team"
        );
        const teamData = await teamRes.json();
        const teamStats = {};
        teamData.forEach((t) => {
          teamStats[t.teamName || "Unknown"] = t.totalClosed;
        });

        // 3. Closed tasks by owner
        const ownerRes = await fetch(
          "http://localhost:4000/report/closed-tasks-owner"
        );
        const ownerData = await ownerRes.json();
        const ownerStats = {};
        ownerData.forEach((o) => {
          ownerStats[o.ownerName || "Unknown"] = o.totalClosed;
        });

        // ✅ Update state safely
        setReportData({
          workDone: [completed, pending],
          tasksByTeam: teamStats,
          tasksByOwner: ownerStats,
        });
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="reports d-flex">
      {/* Sidebar */}
      <Sidebar backToDashboard={true} />

      {/* Main */}
      <main className="main flex-grow-1 p-4 bg-light">
        {/* Header */}
        <header className="header d-flex align-items-center mb-4">
          <h2 className="mb-0">📊 Workasana Reports</h2>
        </header>

        {/* Report Overview */}
        <section className="section">
          <div className="row g-4">
            {/* Total Work Done */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Work Done</h5>
                  <Doughnut
                    data={{
                      labels: ["Completed", "Pending"],
                      datasets: [
                        {
                          data: reportData.workDone.length
                            ? reportData.workDone
                            : [0, 0],
                          backgroundColor: ["#28a745", "#ffc107"],
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tasks Closed by Team */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Tasks Closed by Team</h5>
                  <Bar
                    data={{
                      labels: Object.keys(reportData.tasksByTeam),
                      datasets: [
                        {
                          label: "Tasks Closed",
                          data: Object.values(reportData.tasksByTeam),
                          backgroundColor: "#17a2b8",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tasks Closed by Owner */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Tasks Closed by Owner</h5>
                  <Bar
                    data={{
                      labels: Object.keys(reportData.tasksByOwner),
                      datasets: [
                        {
                          label: "Tasks Closed",
                          data: Object.values(reportData.tasksByOwner),
                          backgroundColor: "#6f42c1",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
