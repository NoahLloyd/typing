import React from "react";

interface TextDisplayProps {
  textToType: string;
  keystrokes: Array<{ key: string; timestamp: Date }>;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
  textToType,
  keystrokes,
}) => {
  let userInput = "";
  let correctInput = "";
  let incorrectInput = "";
  let isIncorrect = false;

  // Reconstruct the user input from keystrokes
  for (const { key } of keystrokes) {
    if (key === "Backspace") {
      userInput = userInput.slice(0, -1);
      if (isIncorrect) {
        incorrectInput = incorrectInput.slice(0, -1);
        if (incorrectInput.length === 0) {
          isIncorrect = false;
        }
      } else {
        correctInput = correctInput.slice(0, -1);
      }
    } else if (key === "Backspace+Option") {
      // Remove the last word
      const lastSpaceIndex = userInput.lastIndexOf(" ");
      userInput = lastSpaceIndex >= 0 ? userInput.slice(0, lastSpaceIndex) : "";
      correctInput = userInput; // Reset correctInput as we cannot determine correctness here
      incorrectInput = "";
      isIncorrect = false;
    } else if (key === "Backspace+Command") {
      // Remove everything to the start of the line
      userInput = "";
      correctInput = "";
      incorrectInput = "";
      isIncorrect = false;
    } else if (
      !key.startsWith("Control") &&
      !key.startsWith("Meta") &&
      !key.startsWith("Alt") &&
      !key.startsWith("Shift")
    ) {
      userInput += key;
      if (userInput.length <= textToType.length) {
        if (
          userInput[userInput.length - 1] === textToType[userInput.length - 1]
        ) {
          if (!isIncorrect) {
            correctInput += key;
          } else {
            incorrectInput += key;
          }
        } else {
          incorrectInput += key;
          isIncorrect = true;
        }
      }
    }
  }

  const remainingText = textToType.substring(userInput.length);

  return (
    <div className="text-center p-4 max-w-2xl mx-auto overflow-auto">
      <p className="text-lg whitespace-pre-wrap">
        <span className="text-white">{correctInput}</span>
        <span className="text-red-500 underline">{incorrectInput}</span>
        <span className="text-white bg-black">|</span>
        <span className="text-gray-500">{remainingText}</span>
      </p>
    </div>
  );
};

export default TextDisplay;
