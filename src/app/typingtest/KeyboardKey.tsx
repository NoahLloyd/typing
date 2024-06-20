import React from "react";

interface KeyboardKeyProps {
  value: string;
  highlight: boolean;
}

const KeyboardKey: React.FC<KeyboardKeyProps> = ({ value, highlight }) => {
  const activeClass = highlight
    ? "ring-2 border-teal-500 ring-teal-500 text-white"
    : "text-slate-400";

  return (
    <button
      className={`p-2 w-9 h-9 border transition-all border-teal-950 flex justify-center items-center m-1 text-lg font-semibold rounded-md ${activeClass}`}
      tabIndex={-1}
    >
      {value}
    </button>
  );
};

export default KeyboardKey;
