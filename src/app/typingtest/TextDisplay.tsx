import React, { useEffect, useRef } from "react";
import { reconstructUserInput } from "./keystrokeUtils";

interface TextDisplayProps {
  textToType: string;
  keystrokes: Array<{ key: string; timestamp: Date }>;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
  textToType,
  keystrokes,
}) => {
  const displayRef = useRef<HTMLDivElement>(null);
  const nextCharRef = useRef<HTMLSpanElement>(null); // Reference for the next character span
  const { userInput, correctInput, incorrectInput } = reconstructUserInput(
    textToType,
    keystrokes
  );

  useEffect(() => {
    if (displayRef.current && nextCharRef.current) {
      const lineHeight = parseInt(
        getComputedStyle(displayRef.current).lineHeight,
        10
      );
      const nextCharRect = nextCharRef.current.getBoundingClientRect();
      const displayRect = displayRef.current.getBoundingClientRect();
      // Calculate the top offset of the next character span relative to the displayRef
      const nextCharOffsetTop = nextCharRef.current.offsetTop;
      // Calculate the fixed offset to keep the middle line in view
      const fixedOffset = lineHeight * 1.3; // Adjust this multiplier to control the vertical position

      // Adjust scrollTop of the displayRef to bring the next character span into view
      if (nextCharRect.bottom + fixedOffset > displayRect.bottom) {
        displayRef.current.scrollTop +=
          nextCharRect.bottom - displayRect.bottom + fixedOffset;
      } else if (nextCharRect.top - fixedOffset < displayRect.top) {
        displayRef.current.scrollTop -=
          displayRect.top - nextCharRect.top + fixedOffset;
      }
    }
  }, [userInput]); // Only re-run the effect if userInput changes
  // Determine the next character to be typed
  const nextCharIndex = correctInput.length + incorrectInput.length;
  const nextChar = textToType[nextCharIndex] || " ";

  return (
    <div
      ref={displayRef}
      className="text-center p-4 my-8 max-w-4xl mx-auto overflow-auto"
      style={{ maxHeight: "11rem", fontSize: "2.25rem" }} // Adjusted for three lines of text
    >
      <p className="whitespace-pre-wrap">
        <span className="text-white">{correctInput}</span>
        <span
          className=""
          style={{
            color: "#fa1f0f",
            textShadow: "0 0 30px #fa1f0f88, 0 0 30px #fa1f0f88",
          }}
        >
          {incorrectInput.length > 0
            ? textToType.substring(correctInput.length, nextCharIndex)
            : ""}
        </span>
        <span ref={nextCharRef} className="bg-slate-500 text-black">
          {nextChar}
        </span>
        <span className="text-gray-500">
          {textToType.substring(nextCharIndex + 1)}
        </span>
      </p>
    </div>
  );
};

export default TextDisplay;
