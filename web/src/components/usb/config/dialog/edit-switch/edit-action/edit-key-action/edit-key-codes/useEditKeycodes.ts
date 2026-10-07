import {useCallback, useRef} from "react";
import type {EditKeycodesProps, Keycodes} from "./EditKeycodes.tsx";

export function useEditKeycodes({part: keycodes, change, isUppercase}: EditKeycodesProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleKeycodeChange = useCallback((value: string, index: number) => {
    if (!(value.trim().length == 0)) inputs.current[index === keycodes.length - 1 ? 0 : index + 1]?.focus();
    const newKeys: Keycodes = [...keycodes];
    newKeys[index] = value.toUpperCase().charCodeAt(0);
    change(newKeys)
  }, [keycodes, change]);

  const handleKeyDown = (key: string, index: number) => {
    if (key === "ArrowLeft" || key === "Delete" || key == "Backspace") {
      inputs.current[index === 0 ? keycodes.length - 1 : index - 1]?.focus()
    } else if (key === "ArrowRight") {
      inputs.current[index === keycodes.length - 1 ? 0 : index + 1]?.focus()
    }
  }

  const value = useCallback((index: number): string => {
    if(!keycodes[index]) return "";
    let code = String.fromCharCode(keycodes[index]);
    return isUppercase ? code.toUpperCase() : code.toLowerCase();
  }, [isUppercase])

  return {
    inputs,
    handleKeycodeChange,
    handleKeyDown,
    value
  }
}