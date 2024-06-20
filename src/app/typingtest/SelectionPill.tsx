import React, { useState, useEffect } from "react";
import { Clock, Type } from "lucide-react";

interface SelectionPillProps {
  onSelect: (type: string, value: number) => void;
}

const SelectionPill: React.FC<SelectionPillProps> = ({ onSelect }) => {
  const [selection, setSelection] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number>(60); // Default to 60 seconds
  const [selectedWord, setSelectedWord] = useState<number>(50); // Default to 50 words

  const timeOptions = [15, 30, 60, 120];
  const wordOptions = [10, 25, 50, 100];

  useEffect(() => {
    // When selection changes, update the parent component with the default values
    if (selection === "time") {
      onSelect("time", selectedTime);
    } else if (selection === "words") {
      onSelect("words", selectedWord);
    }
  }, [selection]);

  const handleSelection = (type: string) => {
    setSelection(type);
  };

  const handleTimeOptionSelect = (time: number) => {
    setSelectedTime(time);
    onSelect("time", time);
  };

  const handleWordOptionSelect = (word: number) => {
    setSelectedWord(word);
    onSelect("words", word);
  };

  return (
    <div className="bg-slate-900 rounded-full px-4 py-2 flex items-center justify-center space-x-4">
      <button
        tabIndex={-1}
        onClick={() => handleSelection("time")}
        className={`flex items-center space-x-2 ${
          selection === "time" ? "text-white" : "text-slate-600"
        }`}
      >
        <Clock className="mr-2" size={16} />
        time
      </button>
      <button
        tabIndex={-1}
        onClick={() => handleSelection("words")}
        className={`flex items-center space-x-2 ${
          selection !== null ? "border-r-2 border-slate-700 pr-4 " : ""
        } ${selection === "words" ? "text-white" : "text-slate-600"}`}
      >
        <Type className="mr-2" size={16} />
        words
      </button>
      <div className="flex space-x-2">
        {selection === "time" &&
          timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeOptionSelect(time)}
              className={`py-1 px-3 rounded text-white ${
                selectedTime === time ? "bg-slate-700" : "bg-transparent"
              }`}
            >
              {time}
            </button>
          ))}
        {selection === "words" &&
          wordOptions.map((word) => (
            <button
              key={word}
              onClick={() => handleWordOptionSelect(word)}
              className={`py-1 px-3 rounded text-white ${
                selectedWord === word ? "bg-slate-700" : "bg-transparent"
              }`}
            >
              {word}
            </button>
          ))}
      </div>
    </div>
  );
};

export default SelectionPill;
