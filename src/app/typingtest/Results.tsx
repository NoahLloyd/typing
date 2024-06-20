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
import { Command } from "lucide-react";

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

  // Calculate the difference in time for the x-axis
  const wpmDataWithTimeDiff = wpmData.map((data, index, array) => ({
    ...data,
    time: index === 0 ? 0 : data.time - array[0].time,
  }));

  // Custom tooltip content
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: any[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 text-white text-xs p-2 rounded shadow-lg">
          <p>{`Time: ${label}s`}</p>
          <p>{`WPM: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

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
          <LineChart data={wpmDataWithTimeDiff}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
            <XAxis dataKey="time" tickFormatter={(time) => `${time}s`} />
            <YAxis stroke="#2f2f2f" />
            <Tooltip
              content={({ active, payload, label }) => (
                <CustomTooltip
                  active={active || false}
                  payload={payload || []}
                  label={label}
                />
              )}
            />
            <Line
              type="monotone"
              dataKey="wpm"
              stroke="#008080"
              strokeWidth={3}
              dot={{ stroke: "#008080", strokeWidth: 2, fill: "#008080" }}
              activeDot={{ r: 6, fill: "#008080", stroke: "none" }}
            />
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
        <div
          onClick={onReplay}
          className="flex items-center justify-center bg-slate-900 py-2 px-4 rounded"
        >
          <p className="mr-3 mb-0">Replay</p>
          <div className=" bg-slate-800 font-light rounded py-1 px-3">
            <button
              onClick={onRestart}
              tabIndex={-1}
              className="text-slate-300"
            >
              R
            </button>
          </div>
          {/* <div className="  font-light rounded">
            <div className="flex gap-1 items-center justify-center">
              <div className="text-slate-300 bg-slate-800 p-2 rounded flex items-center justify-center">
                <Command color="#CBD5E1" size={16} />
              </div>
              <div className="text-slate-300 text-base bg-slate-800 rounded p-2 flex items-center justify-center">
                <div className="h-4 w-4 flex items-center font-medium justify-center">
                  R
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Results;
