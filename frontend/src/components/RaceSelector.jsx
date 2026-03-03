import { useState, useEffect } from "react";
import axios from "axios";

export default function RaceSelector({ onSelect }) {
  const [year, setYear] = useState(2024);
  const [schedule, setSchedule] = useState([]);
  const [round, setRound] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:8000/schedule/${year}`)
      .then(res => {
        const races = res.data.filter(r => r.RoundNumber > 0);
        setSchedule(races);
        setRound(races[0]?.RoundNumber || 1);
      });
  }, [year]);

  return (
    <div className="card">
      <h2>Select Race</h2>
      <select value={year} onChange={e => setYear(Number(e.target.value))}>
        {[2024, 2023, 2022].map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select value={round} onChange={e => setRound(Number(e.target.value))}>
        {schedule.map(r => (
          <option key={r.RoundNumber} value={r.RoundNumber}>
            Round {r.RoundNumber} — {r.EventName}
          </option>
        ))}
      </select>
      <button onClick={() => onSelect({ year, round })}>
        Load Race
      </button>
    </div>
  );
}