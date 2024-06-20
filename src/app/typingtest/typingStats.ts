import { reconstructUserInput } from "./keystrokeUtils";

export function calculateTypingSpeed(
  keystrokes: Array<{ key: string; timestamp: Date }>,
  sourceText: string
): number {
  if (keystrokes.length === 0) return 0;

  // Assuming keystrokes are ordered by timestamp
  const startTime = keystrokes[0].timestamp;
  const endTime = keystrokes[keystrokes.length - 1].timestamp;
  const testDuration = endTime.getTime() - startTime.getTime();

  const wordsTyped = sourceText.split(" ").length;
  const timeElapsed = testDuration / 60000; // convert to minutes
  return Math.round(wordsTyped / timeElapsed);
}

export function calculateAccuracy(
  keystrokes: Array<{ key: string; timestamp: Date }>,
  sourceText: string
): number {
  const { correctInput, incorrectInput } = reconstructUserInput(
    sourceText,
    keystrokes
  );

  const correctChars = correctInput.length;
  const totalChars = correctChars + incorrectInput.length;
  return Math.round((correctChars / totalChars) * 100);
}

export function calculateWPMOverTime(
  keystrokes: Array<{ key: string; timestamp: Date }>,
  sourceText: string
): Array<{ time: number; wpm: number }> {
  const interval = 5; // Calculate WPM every 5 seconds
  const results = [];
  let wordCount = 0;
  let startTime = keystrokes[0]?.timestamp.getTime();

  for (let i = 0; i < keystrokes.length; i++) {
    const currentTime = keystrokes[i].timestamp.getTime();
    if (keystrokes[i].key === " " || keystrokes[i].key === "Enter") {
      wordCount++;
    }
    if (
      currentTime - startTime >= interval * 1000 ||
      i === keystrokes.length - 1
    ) {
      const timePassed = (currentTime - startTime) / 60000; // Convert to minutes
      const wpm = timePassed > 0 ? wordCount / timePassed : 0;
      results.push({
        time: Math.round(currentTime / 1000),
        wpm: Math.round(wpm),
      });
      startTime = currentTime;
      wordCount = 0;
    }
  }

  return results;
}

export function calculateTotalTime(keystrokes: Array<{ key: string; timestamp: Date }>): string {
  if (keystrokes.length === 0) return '0s';

  const startTime = keystrokes[0].timestamp.getTime();
  const endTime = keystrokes[keystrokes.length - 1].timestamp.getTime();
  const totalTime = (endTime - startTime) / 1000; // Convert to seconds

  return `${totalTime}s`;
}