import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#e10600", "#0067FF", "#00D2BE", "#FF8000", "#ffcd00", "#aaaaaa"];

export default function LapTimeChart({ year, round }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/race/${year}/${round}/laps`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, [year, round]);

  if (loading) return <div className="card"><p>Loading lap times...</p></div>;

  const drivers = [...new Set(data.map(d => d.Driver))].slice(0, 6);
  const maxLap = Math.max(...data.map(d => d.LapNumber));

  const byLap = Array.from({ length: maxLap }, (_, i) => {
    const lap = { lap: i + 1 };
    drivers.forEach(d => {
      const entry = data.find(x => x.Driver === d && x.LapNumber === i + 1);
      if (entry) lap[d] = parseFloat(entry.LapTime.toFixed(3));
    });
    return lap;
  });

  return (
    <div className="card">
      <h2>Lap Times</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={byLap}>
          <XAxis dataKey="lap" stroke="#888" label={{ value: "Lap", position: "insideBottom", offset: -5, fill: "#888" }} />
          <YAxis stroke="#888" domain={["auto", "auto"]} tickFormatter={v => `${v}s`} />
          <Tooltip formatter={(v) => `${v}s`} contentStyle={{ background: "#222", border: "1px solid #444" }} />
          <Legend />
          {drivers.map((d, i) => (
            <Line key={d} dataKey={d} stroke={COLORS[i]} dot={false} strokeWidth={2} connectNulls />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}