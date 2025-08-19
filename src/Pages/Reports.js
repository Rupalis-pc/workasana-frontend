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
    workDone: [5, 7], // Example: 5 completed, 7 pending last week
    pendingDays: [3, 2, 4, 1, 5, 0, 6], // Example per day
    tasksByTeam: { Design: 8, Dev: 12, QA: 6 },
    tasksByOwner: { Ujjwal: 5, Aarti: 7, Rahul: 3 },
  });

  useEffect(() => {
    // Fetch reports data from backend
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:4000/reports");
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      } catch (err) {
        console.error("Error fetching reports", err);
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
            {/* Total Work Done Last Week */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Work Done Last Week</h5>
                  <Doughnut
                    data={{
                      labels: ["Completed", "Pending"],
                      datasets: [
                        {
                          data: reportData.workDone,
                          backgroundColor: ["#28a745", "#ffc107"],
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Total Days of Work Pending */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Days of Work Pending</h5>
                  <Bar
                    data={{
                      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                      datasets: [
                        {
                          label: "Pending Tasks",
                          data: reportData.pendingDays,
                          backgroundColor: "#007bff",
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
