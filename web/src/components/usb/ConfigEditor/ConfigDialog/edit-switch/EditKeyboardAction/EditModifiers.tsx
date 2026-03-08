import {ArrowBigUp, ArrowBigUpDash, ArrowDown01, Grid2X2, MouseOff} from "lucide-react";
import {useCallback} from "react";
import styles
  from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeyboardAction.module.css";
import {Toggle} from "@/shadcn/components/ui/toggle.tsx";
import type {SlimKeyReport} from "../../../../../../../bindings/SlimKeyReport";

type EditModifiersProps = {
  modifier: SlimKeyReport["modifier"],
  change: (num: SlimKeyReport["modifier"]) => void,
}

export function EditModifiers({modifier, change}: EditModifiersProps) {
  const bits = toBits(modifier);
  const handleModifierChange = useCallback((index: number, pressed: boolean) => {
    let bits = toBits(modifier);
    bits[index] = pressed ? 1 : 0;
    change(parseInt(bits.join(''), 2));
  }, [change]);

  return (<div className={styles.row}>
        {modifierList.map((Component, i) => {
          return <Toggle
              variant={"outline"}
              size={"sm"}
              key={`modifier-toggle-${i}`}
              aria-label={"Toggle modifier"}
              pressed={bits[i] == 1}
              onPressedChange={(on) => handleModifierChange(i, on)}
          >
            <Component className="group-data-[state=on]/toggle:fill-foreground"/>
          </Toggle>;
        })}
      </div>
  );
}


function toBits(num: number) {
  let bits = num.toString(2).split('').map(Number);
  return [
    ...[...Array(8 - bits.length)].map((_, _i) => 0),
    ...bits
  ];

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
