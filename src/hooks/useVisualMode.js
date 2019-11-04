import { useState } from "react";

// ----- take in an initial mode, set the mode state with the intital mode provided and return object with a property mode ----- //
export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode])

  // ----- transition back to previous mode in history array ----- //
  const back = () => {
    setHistory((currentHistory) => {
      setMode((currentMode) => {
        if (currentHistory[currentHistory.length - 1] !== initialMode) {
          setMode(currentHistory[currentHistory.length - 2]);
          currentHistory.pop();
          return currentHistory;
        } else {
          setMode(currentHistory[currentHistory.length - 1])
        }
      })
      return currentHistory;
    })
  }

  // ----- take in a new mode and update the mode state with the new value. Add new mode to history ----- //
  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory((currentHistory) => {
        currentHistory.pop();
        return [...currentHistory, newMode];
      })
    } else {
        setHistory((currentHistory) => {
          return [...currentHistory, newMode];
        })
      }
    setMode(newMode);
  
    }
  return {
    mode,
    transition,
    back
  }
} 