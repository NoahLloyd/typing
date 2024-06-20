"use client";
import React from "react";

interface ResultsProps {
  speed: number;
  accuracy: number;
  onReplay: () => void; // Add this line
}

const Results: React.FC<ResultsProps> = ({ speed, accuracy, onReplay }) => {
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
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Results</h1>
      <p className="text-xl">Words per minute: {speed}</p>
      <p className="text-xl">Accuracy: {accuracy}%</p>
      <div className="flex items-center justify-center bg-slate-900 py-2 px-4 my-4 rounded">
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
  );
};

export default Results;
