export function calculateTypingSpeed(
  keystrokes: Array<{ key: string; timestamp: Date }>,
  startTime: Date | null,
  endTime: Date | null
): number {
  if (!startTime || !endTime || keystrokes.length === 0) return 0;

  // Filter out non-character keys and reconstruct the user input
  const userInput = keystrokes
    .filter(
      (k) =>
        !k.key.startsWith("Control") &&
        !k.key.startsWith("Meta") &&
        !k.key.startsWith("Alt") &&
        !k.key.startsWith("Shift")
    )
    .map((k) => (k.key === "Backspace" ? "" : k.key))
    .join("");

  const wordsTyped = userInput.split(" ").filter(Boolean).length;
  const timeElapsed = (endTime.getTime() - startTime.getTime()) / 60000; // convert to minutes
  return Math.round(wordsTyped / timeElapsed);
}

export function calculateAccuracy(
  keystrokes: Array<{ key: string; timestamp: Date }>,
  sourceText: string
): number {
  // Reconstruct the user input
  let userInput = "";
  for (const k of keystrokes) {
    if (k.key === "Backspace") {
      userInput = userInput.slice(0, -1);
    } else if (
      !k.key.startsWith("Control") &&
      !k.key.startsWith("Meta") &&
      !k.key.startsWith("Alt") &&
      !k.key.startsWith("Shift")
    ) {
      userInput += k.key;
    }
  }

  const charTyped = userInput.length;
  const charTotal = sourceText.length;
  let errors = 0;
  let sourceIndex = 0;

  for (let i = 0; i < charTyped; i++) {
    if (sourceText[sourceIndex] !== userInput[i]) {
      errors++;
    } else {
      sourceIndex++;
    }
  }

  errors += charTotal - sourceIndex; // Add remaining source text characters as errors

  return Math.round(((charTyped - errors) / charTotal) * 100);
}
