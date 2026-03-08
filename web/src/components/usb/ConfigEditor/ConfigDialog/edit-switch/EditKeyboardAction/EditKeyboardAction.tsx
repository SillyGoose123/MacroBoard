import {ArrowBigUp, ArrowBigUpDash, ArrowDown01, Grid2X2, Keyboard, MouseOff} from "lucide-react";
import type {SlimKeyReport} from "@/../bindings/SlimKeyReport";
import styles
  from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeyboardAction.module.css";
import {
  EditU8Mapped
} from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditU8MappedProps.tsx";
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
      <EditU8Mapped
          value={action.modifier}
          options={[
            ArrowBigUp,
            () => <span>CTRL</span>,
            () => <span>ALT</span>,
            () => <span>ALT GR</span>,
            ArrowBigUpDash,
            ArrowDown01,
            Grid2X2,
            MouseOff
          ]}
          change={(num) => change({...action, modifier: num})}
      />
    </div>
  </>);
}