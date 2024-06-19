"use client";
import React from "react";

interface ResultsProps {
  speed: number;
  accuracy: number;
}

const Results: React.FC<ResultsProps> = ({ speed, accuracy }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Results</h1>
      <p className="text-xl">Words per minute: {speed}</p>
      <p className="text-xl">Accuracy: {accuracy}%</p>
    </div>
  );
};

export default Results;
