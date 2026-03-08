import {Keyboard} from "lucide-react";
import type {SlimKeyReport} from "@/../bindings/SlimKeyReport";
import styles
  from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeyboardAction.module.css";
import {
  EditModifiers
} from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditModifiers.tsx";
import {EditKeycodes} from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeycodes.tsx";

type EditKeyboardAction = {
  action: SlimKeyReport,
  change: (key: SlimKeyReport) => void,
}

export function EditKeyboardAction({action, change}: EditKeyboardAction) {
  return (<>
    <Keyboard/>
    <div className={styles.column}>
      <EditKeycodes
          keycodes={action.keycodes}
          change={(keycodes) => change({...action, keycodes: keycodes})}
      />
      <EditModifiers
          modifier={action.modifier}
          change={(num) => change({...action, modifier: num})}
      />
    </div>
  </>);
}