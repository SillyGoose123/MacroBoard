import {ArrowBigUp, ArrowBigUpDash, ArrowDown01, Grid2X2, Keyboard, MouseOff} from "lucide-react";
import {Input} from "@/shadcn/components/ui/input.tsx";
import type {SlimKeyReport} from "@/../bindings/SlimKeyReport";
import styles
  from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeyboardAction.module.css";
import {Toggle} from "@/shadcn/components/ui/toggle.tsx";
import {useCallback} from "react";

type EditKeyboardAction = {
  action: SlimKeyReport,
  change: (key: SlimKeyReport) => void,
}

//TODO: Modifier fixxen
export function EditKeyboardAction({action, change}: EditKeyboardAction) {
  const handleKeycodeChange = useCallback((value: string, i: number) => {
    const keycodes: typeof action.keycodes = [...action.keycodes];
    keycodes[i] = value.charCodeAt(0);
    change({...action, keycodes})
  }, [action, change]);

  const handleModifierChange = useCallback((index: number, pressed: boolean) => {
    let bits = toBits(action.modifier);
    bits[index] = pressed ? 1 : 0;
    change({...action, modifier: parseInt(bits.join(''), 2)});
  }, [action, change]);

  return (<>
    <Keyboard/>
    <div className={styles.column}>
      <div className={styles.row}>
        {[...Array(6)].map((_, i) => (
            <Input
                key={`keyboard-input-${i}`}
                maxLength={1}
                value={!action.keycodes[i] ? "" : String.fromCharCode(action.keycodes[i])}
                onChange={(e) => handleKeycodeChange(e.target.value, i)}
            />
        ))}
      </div>

      <div className={styles.row}>
        {modifierList.map((Component, i) => {
          return <Toggle
              variant={"outline"}
              size={"sm"}
              key={`modifier-toggle-${i}`}
              aria-label={"Toggle modifier"}
              pressed={toBits(action.modifier)[i] == 1}
              onPressedChange={(on) => handleModifierChange(i, on)}
          >
            <Component className="group-data-[state=on]/toggle:fill-foreground"/>
          </Toggle>;
        })}
      </div>
    </div>
  </>);
}

function toBits(num: number) {
  let bits = num.toString(2).split('').map(Number);
  return [...Array(8)].map((_, i) => bits[i] ?? 0);

}

const modifierList = [
  ArrowBigUp,
  () => <span>CTRL</span>,
  () => <span>ALT</span>,
  () => <span>ALT GR</span>,
  ArrowBigUpDash,
  ArrowDown01,
  Grid2X2,
  MouseOff
];
