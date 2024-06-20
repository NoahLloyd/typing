"use client";

import React, { useState, useEffect } from "react";
import TextDisplay from "./TextDisplay";
import Results from "./Results";
import { generateText } from "./textGenerator";
import { reconstructUserInput } from "./keystrokeUtils";
import { Clock, Type } from "lucide-react"; // Import Lucide icons
import SelectionPill from "./SelectionPill";

const TestContainer: React.FC = () => {
  const [keystrokes, setKeystrokes] = useState<
    Array<{ key: string; timestamp: Date }>
  >([]);
  const [testEnded, setTestEnded] = useState<boolean>(false);
  const [textToType, setTextToType] = useState<string>("");
  const [selectionType, setSelectionType] = useState<string>("words");
  const [selectionValue, setSelectionValue] = useState<number>(15);

  const handleSelect = (type: string, value: number) => {
    console.log(`${type} selected:`, value);
    setSelectionType(type);
    setSelectionValue(value);
    restartTest();
  };

  useEffect(() => {
    const fetchText = () => {
      const text = generateText(
        selectionType === "words" ? selectionValue : undefined
      );
      setTextToType(text);
    };

    fetchText();
  }, [selectionType, selectionValue]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [testEnded, textToType, keystrokes]);

  const testDuration =
    keystrokes.length >= 2
      ? keystrokes[keystrokes.length - 1].timestamp.getTime() -
        keystrokes[0].timestamp.getTime()
      : 0;

  useEffect(() => {
    if (selectionType === "time" && testDuration >= selectionValue * 1000) {
      setTestEnded(true);
    }
  }, [testDuration, selectionType, selectionValue]);

  const restartTest = () => {
    setKeystrokes([]);
    setTestEnded(false);
    setTextToType(
      generateText(selectionType === "words" ? selectionValue : undefined)
    );
  };

  const replayTest = () => {
    setTestEnded(false);
    setTextToType(textToType);

    let replayIndex = 0;
    const replayKeystrokes = () => {
      if (replayIndex < keystrokes.length) {
        const currentKeystroke = keystrokes[replayIndex];
        const nextKeystroke = keystrokes[replayIndex + 1];
        const delay = nextKeystroke
          ? nextKeystroke.timestamp.getTime() -
            currentKeystroke.timestamp.getTime()
          : 1000;

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

    setKeystrokes([]);
    setTimeout(replayKeystrokes, 300);
  };

  return (
    <div className="flex flex-col w-full bg-slate-950 items-center justify-center">
      {keystrokes.length === 0 && <SelectionPill onSelect={handleSelect} />}

      {!testEnded ? (
        <>
          <TextDisplay textToType={textToType} keystrokes={keystrokes} />
          <div className="flex items-center justify-center bg-slate-900 py-2 px-4 rounded">
            <button tabIndex={-1} onClick={restartTest} className="mr-3">
              Restart
            </button>
            <div className="bg-slate-800 font-light rounded py-1 px-3">
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
            timeLimit={selectionType === "time" ? selectionValue : null}
          />
        </>
      )}
    </div>
  );
};

export default TestContainer;
