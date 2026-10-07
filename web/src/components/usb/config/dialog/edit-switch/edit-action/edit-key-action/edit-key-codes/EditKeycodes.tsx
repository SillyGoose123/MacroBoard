import type {EditCompProps} from "@/components/usb/config/configLogic.ts";
import type {SlimKeyReport} from "@bindings/SlimKeyReport";
import {Input} from "@/shadcn/ui/input.tsx";
import styles from "./EditKeycodes.module.css";
import {
  useEditKeycodes
} from "@/components/usb/config/dialog/edit-switch/edit-action/edit-key-action/edit-key-codes/useEditKeycodes.ts";

export type Keycodes = SlimKeyReport["keycodes"];
export type EditKeycodesProps = EditCompProps<Keycodes> & {
  isUppercase: boolean
};
export function EditKeycodes({part: keycodes, change, isUppercase}: EditKeycodesProps) {
  const {inputs, handleKeycodeChange, handleKeyDown, value} = useEditKeycodes({part: keycodes, change, isUppercase});

  return (
    <div className={"row"}>
      {[...Array(6)].map((_, i) => (
        <Input
          key={`keyboard-input-${i}`}
          maxLength={1}
          className={styles.input}
          ref={(el) => {inputs.current[i] = el}}
          value={value(i)}
          onChange={(e) => handleKeycodeChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e.key, i)}
        />
      ))}
    </div>
  );
}