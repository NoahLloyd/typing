import React from "react";
import {
  calculateTypingSpeed,
  calculateAccuracy,
  calculateWPMOverTime,
  calculateTotalTime,
} from "./typingStats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ResultsProps {
  keystrokes: Array<{ key: string; timestamp: Date }>;
  sourceText: string;
  onReplay: () => void;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({
  keystrokes,
  sourceText,
  onReplay,
  onRestart,
}) => {
  const speed = calculateTypingSpeed(keystrokes, sourceText);
  const accuracy = calculateAccuracy(keystrokes, sourceText);
  const wpmData = calculateWPMOverTime(keystrokes, sourceText);
  const totalTime = calculateTotalTime(keystrokes);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "r" || event.key === "R") {
        onReplay();
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [onReplay]); // Ensure the effect runs again if onReplay changes

  return (
    <div className="w-full p-8">
      <div className="flex flex-row gap-10 mb-8">
        <div className="flex flex-col space-y-4">
          <div className=" p-3 bg-slate-900 rounded">
            <p className="text-md text-gray-500 uppercase">WPM</p>
            <p className="text-5xl font-bold">{speed}</p>
          </div>
          <div className="p-3 bg-slate-900 rounded">
            <p className="text-md text-gray-500 uppercase">ACC</p>
            <p className="text-5xl font-bold">{accuracy}%</p>
          </div>
          <div className="p-3 bg-slate-900 rounded">
            <p className="text-md text-gray-500 uppercase">TIME</p>
            <p className="text-5xl font-bold">{totalTime}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={wpmData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="wpm" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center bg-slate-900 py-2 px-4 rounded">
          <button onClick={onRestart} className="mr-3" tabIndex={-1}>
            Restart
          </button>
          <div className=" bg-slate-800 font-light rounded py-1 px-3">
            <button
              onClick={onRestart}
              tabIndex={-1}
              className="text-slate-300"
            >
              ⇥
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center bg-slate-900 py-2 px-4 rounded">
          <button onClick={onReplay} className="mr-3 ">
            Replay
          </button>
          <div className=" bg-slate-800 font-light rounded py-1 px-3">
            <button onClick={onReplay} className="text-slate-300">
              R
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
