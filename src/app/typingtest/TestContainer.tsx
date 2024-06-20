"use client";

import React, { useState, useEffect, useRef } from "react";
import TextDisplay from "./TextDisplay";
import Results from "./Results";
import { generateText } from "./textGenerator";
import { reconstructUserInput } from "./keystrokeUtils";
import { Clock, Type } from "lucide-react"; // Import Lucide icons
import SelectionPill from "./SelectionPill";
import VirtualKeyboard from "./VirtualKeyboard";

const TestContainer: React.FC = () => {
  const [keystrokes, setKeystrokes] = useState<
    Array<{ key: string; timestamp: Date }>
  >([]);
  const [originalKeystrokes, setOriginalKeystrokes] = useState<
    Array<{ key: string; timestamp: Date }>
  >([]);
  const [testEnded, setTestEnded] = useState<boolean>(false);
  const [replaying, setReplaying] = useState<boolean>(false);
  const [textToType, setTextToType] = useState<string>("");
  const [selectionType, setSelectionType] = useState<string>("time");
  const [selectionValue, setSelectionValue] = useState<number>(15);

  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const errorSoundRef = useRef<HTMLAudioElement>(null);

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

        setKeystrokes((prevKeystrokes) => {
          const newKeystrokes = [
            ...prevKeystrokes,
            { key: keyValue, timestamp: new Date() },
          ];

          // Determine if the last keystroke was correct
          const { userInput, isIncorrect } = reconstructUserInput(
            textToType,
            newKeystrokes
          );

          // Play the appropriate sound
          if (isIncorrect && errorSoundRef.current) {
            const errorSound = errorSoundRef.current.cloneNode(
              true
            ) as HTMLAudioElement;
            errorSound.volume = 0.2;
            errorSound.play();
          } else if (
            keyValue !== "Backspace" &&
            keyValue !== "Shift" &&
            !isSpecialCombination
          ) {
            // Select a random click sound
            const clickSoundNumber = Math.ceil(Math.random() * 6);
            const clickSoundPath = `/sounds/click${clickSoundNumber}.wav`;
            const clickSound = new Audio(clickSoundPath);
            clickSound.volume = 0.18;
            clickSound.play();
          }
          // Check if the test should end
          if (userInput.length === textToType.length - 1 && !isIncorrect) {
            setTestEnded(true);
          }

          return newKeystrokes;
        });
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
    setOriginalKeystrokes(keystrokes); // Store the original keystrokes
    setTestEnded(false);
    setReplaying(true);
    setTextToType(textToType);

    let replayIndex = 0;
    const replayKeystrokes = () => {
      if (replaying) {
        setKeystrokes(originalKeystrokes); // Restore the original keystrokes
        return;
      }

      if (replayIndex < originalKeystrokes.length) {
        const currentKeystroke = originalKeystrokes[replayIndex];
        const nextKeystroke = originalKeystrokes[replayIndex + 1];
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
        setReplaying(false);
      }
    };

    setKeystrokes([]); // Clear current keystrokes to start replay
    setTimeout(replayKeystrokes, 300);
  };

  return (
    <div className="flex flex-col w-full bg-slate-950 items-center justify-center">
      {keystrokes.length === 0 && <SelectionPill onSelect={handleSelect} />}

      {!testEnded ? (
        <>
          <TextDisplay
            textToType={textToType}
            keystrokes={keystrokes}
            replaying={replaying}
            setReplaying={setReplaying}
          />
          <VirtualKeyboard keystrokes={keystrokes} />
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
      <audio ref={clickSoundRef} src="/sounds/click.wav" preload="auto" />
      <audio ref={errorSoundRef} src="/sounds/error.wav" preload="auto" />
    </div>
  );
};

export default TestContainer;
