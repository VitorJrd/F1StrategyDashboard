import { useEffect, useState } from "react";
import axios from "axios";

const TIRE_COLORS = {
  SOFT: "#e10600",
  MEDIUM: "#ffd700",
  HARD: "#fff",
  INTERMEDIATE: "#39b54a",
  WET: "#0067ff",
};

export default function TireStrategy({ year, round }) {
  const [laps, setLaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/race/${year}/${round}/laps`)
      .then(res => {
        setLaps(res.data);
        setLoading(false);
      });
  }, [year, round]);

  if (loading) return <div className="card"><p>Loading tire strategy...</p></div>;

  const drivers = [...new Set(laps.map(d => d.Driver))];
  const maxLap = Math.max(...laps.map(d => d.LapNumber));

  return (
    <div className="card">
      <h2>Tire Strategy</h2>
      <div style={{ overflowX: "auto" }}>
        {drivers.map(driver => {
          const driverLaps = laps.filter(l => l.Driver === driver);
          return (
            <div key={driver} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <span style={{ width: 40, fontSize: 12, color: "#aaa" }}>{driver}</span>
              <div style={{ display: "flex" }}>
                {Array.from({ length: maxLap }, (_, i) => {
                  const lap = driverLaps.find(l => l.LapNumber === i + 1);
                  const color = lap ? (TIRE_COLORS[lap.Compound] || "#555") : "#222";
                  return (
                    <div key={i} title={`Lap ${i+1}: ${lap?.Compound || "N/A"}`}
                      style={{ width: 8, height: 20, background: color, marginRight: 1, borderRadius: 2 }} />
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {Object.entries(TIRE_COLORS).map(([name, color]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, background: color, borderRadius: 2 }} />
              <span style={{ fontSize: 12, color: "#aaa" }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}