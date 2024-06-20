"use client";

import React, { useState, useEffect } from "react";
import TextDisplay from "./TextDisplay";
import Results from "./Results";
import { generateText } from "./textGenerator";
import { reconstructUserInput } from "./keystrokeUtils";

const TestContainer: React.FC = () => {
  const [keystrokes, setKeystrokes] = useState<
    Array<{ key: string; timestamp: Date }>
  >([]);
  const [testEnded, setTestEnded] = useState<boolean>(false);
  const [textToType, setTextToType] = useState<string>("");

  useEffect(() => {
    const fetchText = async () => {
      const text = await generateText();
      setTextToType(text);
    };

    fetchText();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Removed testStarted check

      const isSpecialCombination = event.metaKey || event.altKey;
      const keyValue = isSpecialCombination
        ? `${event.key}+${event.metaKey ? "Command" : ""}${
            event.altKey ? "Option" : ""
          }`
        : event.key;

      if (keyValue === "Tab") {
        restartTest();
      } else {
        if (testEnded) return;

        setKeystrokes((prevKeystrokes) => [
          ...prevKeystrokes,
          { key: keyValue, timestamp: new Date() },
        ]);

        const { userInput, isIncorrect } = reconstructUserInput(
          textToType,
          keystrokes
        );
        if (userInput.length === textToType.length - 1 && !isIncorrect) {
          setTestEnded(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [testEnded, textToType, keystrokes]); // Removed testStarted from the dependency array

  // Calculate the test duration based on the first and last keystroke timestamps
  const testDuration =
    keystrokes.length >= 2
      ? keystrokes[keystrokes.length - 1].timestamp.getTime() -
        keystrokes[0].timestamp.getTime()
      : 0;

  // Function to reset the test
  const restartTest = () => {
    setKeystrokes([]);
    setTestEnded(false);
    setTextToType("");
    // Fetch new text to type
    const fetchText = () => {
      const text = generateText();
      setTextToType(text);
    };
    fetchText();
  };

  const replayTest = () => {
    setTestEnded(false);
    setTextToType(textToType); // Ensure the text is set for replay

    let replayIndex = 0;
    const replayKeystrokes = () => {
      if (replayIndex < keystrokes.length) {
        const currentKeystroke = keystrokes[replayIndex];
        const nextKeystroke = keystrokes[replayIndex + 1];
        const delay = nextKeystroke
          ? nextKeystroke.timestamp.getTime() -
            currentKeystroke.timestamp.getTime()
          : 1000; // Arbitrary delay after the last keystroke

        setKeystrokes((prevKeystrokes) => [
          ...prevKeystrokes,
          currentKeystroke,
        ]);

        replayIndex++;
        setTimeout(replayKeystrokes, delay);
      } else {
        setTestEnded(true);
      }
    };

    setKeystrokes([]); // Clear current keystrokes
    setTimeout(replayKeystrokes, 300); // Start replay after 300 milliseconds
  };

  return (
    <div className="flex flex-col bg-slate-950 items-center justify-center">
      {!testEnded ? (
        <>
          <TextDisplay textToType={textToType} keystrokes={keystrokes} />
          <div className="flex items-center justify-center bg-slate-900 py-2 px-4 rounded">
            <button tabIndex={-1} onClick={restartTest} className="mr-3 ">
              Restart
            </button>
            <div className=" bg-slate-800 font-light rounded py-1 px-3">
              <button
                tabIndex={-1}
                onClick={restartTest}
                className="text-slate-300"
              >
                ⇥
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Results
            keystrokes={keystrokes}
            sourceText={textToType}
            onReplay={replayTest}
            onRestart={restartTest}
          />
        </>
      )}
    </div>
  );
};

export default TestContainer;
