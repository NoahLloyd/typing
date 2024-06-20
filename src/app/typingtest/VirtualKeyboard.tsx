import React, { useEffect, useState } from "react";
import KeyboardKey from "./KeyboardKey";

interface VirtualKeyboardProps {
  keystrokes: Array<{ key: string; timestamp: Date }>;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ keystrokes }) => {
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  useEffect(() => {
    if (keystrokes.length > 0) {
      const latestKeystroke = keystrokes[keystrokes.length - 1].key;
      setHighlightedKey(latestKeystroke);

      const timer = setTimeout(() => {
        setHighlightedKey(null);
      }, 200); // Highlight for 200ms

      return () => clearTimeout(timer);
    }
  }, [keystrokes]);

  const keyRows = ["qwertyuiop[]", "asdfghjkl;'", "zxcvbnm,./"].map((row) =>
    row?.split("")
  );

  return (
    <div className="mt-8">
      {keyRows.map((row, index) => (
        <div key={index} className="flex justify-center">
          {row?.map((key) => (
            <KeyboardKey
              key={key}
              value={key}
              highlight={highlightedKey === key}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
