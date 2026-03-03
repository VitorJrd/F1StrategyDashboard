import { useState } from "react";
import RaceSelector from "./components/RaceSelector";
import LapTimeChart from "./components/LapTimeChart";
import TireStrategy from "./components/TireStrategy";
import "./App.css";

function App() {
  const [selection, setSelection] = useState(null);

  return (
    <div className="app">
      <header>
        <h1>🏎️ F1 Strategy Dashboard</h1>
      </header>
      <main>
        <RaceSelector onSelect={setSelection} />
        {selection && (
          <>
            <LapTimeChart year={selection.year} round={selection.round} />
            <TireStrategy year={selection.year} round={selection.round} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;