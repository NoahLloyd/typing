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
import { Option } from "lucide-react";

interface ResultsProps {
  keystrokes: Array<{ key: string; timestamp: Date }>;
  sourceText: string;
  timeLimit: number | null;
  onReplay: () => void;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({
  keystrokes,
  sourceText,
  onReplay,
  onRestart,
  timeLimit = null,
}) => {
  let speed;
  let totalTime;
  if (timeLimit) {
    speed = calculateTypingSpeed(keystrokes, sourceText, timeLimit);
    totalTime = timeLimit;
  } else {
    totalTime = calculateTotalTime(keystrokes);
    speed = calculateTypingSpeed(keystrokes, sourceText);
  }
  const accuracy = calculateAccuracy(keystrokes, sourceText);
  const wpmData = calculateWPMOverTime(keystrokes, sourceText);

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
      console.log(event);
      if (event.key === "π") {
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
    <div className="w-full">
      <div className="flex flex-row gap-10 mb-8">
        <div className="flex flex-col space-y-4">
          <div className=" ">
            <p className="text-md text-slate-500 uppercase">WPM</p>
            <p className="text-5xl font-bold text-slate-100">{speed}</p>
          </div>
          <div className="">
            <p className="text-md text-slate-500 uppercase">ACC</p>
            <p className="text-5xl font-bold text-slate-100">{accuracy}%</p>
          </div>
          <div className="">
            <p className="text-md text-slate-500 uppercase">TIME</p>
            <p className="text-5xl font-bold text-slate-100">{totalTime}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={wpmDataWithTimeDiff}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              stroke="#1E293B"
              dataKey="time"
              tickFormatter={(time) => `${time}s`}
            />
            <YAxis stroke="#1E293B" />
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
              stroke="#CBD5E1"
              strokeWidth={3}
              dot={{ stroke: "#CBD5E1", strokeWidth: 2, fill: "#CBD5E1" }}
              activeDot={{ r: 6, fill: "#CBD5E1", stroke: "none" }}
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

          <div className="  font-light rounded">
            <div className="flex gap-1 items-center justify-center">
              <div className="text-slate-300 bg-slate-800 p-2 rounded flex items-center justify-center">
                <Option color="#CBD5E1" size={16} />
              </div>
              <div className="text-slate-300 text-base bg-slate-800 rounded p-2 flex items-center justify-center">
                <div className="h-4 w-4 flex items-center font-medium justify-center">
                  P
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
