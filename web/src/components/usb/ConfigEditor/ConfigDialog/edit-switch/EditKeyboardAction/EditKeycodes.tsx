import {useCallback, useRef} from "react";
import type {SlimKeyReport} from "../../../../../../../bindings/SlimKeyReport";
import styles
  from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeyboardAction.module.css";
import {Input} from "@/shadcn/components/ui/input.tsx";

type EditKeycodesProps = {
  keycodes: SlimKeyReport["keycodes"],
  change: (keycodes: SlimKeyReport["keycodes"]) => void,
}


export function EditKeycodes({keycodes, change}: EditKeycodesProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleKeycodeChange = useCallback((value: string, index: number) => {
    if (!(value.trim().length == 0)) inputs.current[index === keycodes.length - 1 ? 0 : index + 1]?.focus();

    const newKeys: SlimKeyReport["keycodes"] = [...keycodes];
    newKeys[index] = value.charCodeAt(0);
    change(newKeys)
  }, [keycodes, change]);

  const handleKeyDown = (key: string, index: number) => {
    if (key === "ArrowLeft" || key === "Delete" || key == "Backspace") {
      inputs.current[index === 0 ? keycodes.length - 1 : index - 1]?.focus()
    } else if (key === "ArrowRight") {
      inputs.current[index === keycodes.length - 1 ? 0 : index + 1]?.focus()
    }
  }

  return (
      <div className={styles.row}>
        {[...Array(6)].map((_, i) => (
            <Input
                key={`keyboard-input-${i}`}
                maxLength={1}
                className={styles.input}
                ref={(el) => {
                  inputs.current[i] = el
                }}
                value={!keycodes[i] ? "" : String.fromCharCode(keycodes[i])}
                onChange={(e) => handleKeycodeChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e.key, i)}
            />
        ))}
      </div>
  );
}