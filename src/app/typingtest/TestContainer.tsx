"use client";

import React, { useState, useEffect } from "react";
import TextDisplay from "./TextDisplay";
import Results from "./Results";
import { calculateTypingSpeed, calculateAccuracy } from "./typingStats";
import { generateText } from "./textGenerator";

const TestContainer: React.FC = () => {
  const [keystrokes, setKeystrokes] = useState<
    Array<{ key: string; timestamp: Date }>
  >([]);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testEnded, setTestEnded] = useState<boolean>(false);
  const [textToType, setTextToType] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchText = async () => {
      const text = await generateText();
      setTextToType(text);
    };

    fetchText();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!testStarted) {
        setTestStarted(true);
        setStartTime(new Date());
      }

      const key = event.key;
      const isSpecialCombination = event.metaKey || event.altKey;
      const keyValue = isSpecialCombination
        ? `${event.key}+${event.metaKey ? "Command" : ""}${
            event.altKey ? "Option" : ""
          }`
        : event.key;

      setKeystrokes((prevKeystrokes) => [
        ...prevKeystrokes,
        { key: keyValue, timestamp: new Date() },
      ]);

      if (event.key === "Enter" && !testEnded) {
        // Assuming Enter is used to signal the end of the test
        setTestEnded(true);
        setEndTime(new Date());
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [testStarted, testEnded]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!testEnded ? (
        <TextDisplay textToType={textToType} keystrokes={keystrokes} />
      ) : (
        <Results
          speed={calculateTypingSpeed(keystrokes, startTime, endTime)}
          accuracy={calculateAccuracy(keystrokes, textToType)}
        />
      )}
    </div>
  );
};

export default TestContainer;
