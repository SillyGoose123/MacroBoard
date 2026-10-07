import type {SlimKeyReport} from "@bindings/SlimKeyReport";
import type {EditCompProps} from "@/components/usb/config/configLogic.ts";
import {ArrowBigUp, ArrowBigUpDash, ArrowDown01, Grid2X2, Keyboard, MouseOff} from "lucide-react";
import {EditU8Mapped} from "@/components/usb/config/dialog/edit-switch/edit-action/common/EditU8Mapped.tsx";
import {
  EditKeycodes
} from "@/components/usb/config/dialog/edit-switch/edit-action/edit-key-action/edit-key-codes/EditKeycodes.tsx";

export function EditKeyAction({change, part: {keycodes, modifier}}: EditCompProps<SlimKeyReport>) {
  return (<>
    <Keyboard/>
    <EditKeycodes
      isUppercase={(modifier & (1 << 0)) !== 1}
      part={keycodes}
      change={(keycodes) => change({modifier, keycodes: keycodes})}
    />
    <EditU8Mapped
      part={modifier}
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
      change={(num) => change({modifier: num, keycodes})}
    />
  </>);
}