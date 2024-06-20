export function reconstructUserInput(
  textToType: string,
  keystrokes: Array<{ key: string; timestamp: Date }>
) {
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
      // Remove the last word, but leave the preceding space if it exists
      const lastCharIsSpace = userInput.endsWith(" ");
      let lastSpaceIndex = userInput.lastIndexOf(" ");

      // If the last character is a space, find the space before it
      if (lastCharIsSpace && lastSpaceIndex > 0) {
        lastSpaceIndex = userInput.lastIndexOf(" ", lastSpaceIndex - 1);
      }

      userInput =
        lastSpaceIndex >= 0 ? userInput.slice(0, lastSpaceIndex + 1) : "";
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

  return { userInput, correctInput, incorrectInput, isIncorrect };
}
