import type {MouseReport} from "@/../bindings/MouseReport";
import {Mouse} from "lucide-react";
import {
  EditU8Mapped
} from "@/components/usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditU8MappedProps.tsx";
import styles
  from "@/components/usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeyboardAction.module.css";
import {Input} from "@/shadcn/components/ui/input";

type EditMouseActionProps = {
  action: MouseReport,
  change: (report: MouseReport) => void,
};


export function EditMouseAction({action, change}: EditMouseActionProps) {
  return (
      <>
        <Mouse/>

        <div className={styles.column}>
          <EditU8Mapped
              value={action.buttons}
              options={[...Array(8)].map((_, index) => () => <span>{index + 1}</span>)}
              change={(num) => change({...action, buttons: num})}
          />

          <div className={styles.row}>
            X:
            <Input
                id="input-x-cord"
                value={action.x}
                onChange={(e) => change({...action, x: parseNum(e.target.value)})}
                pattern={"/^\d+$/"}

            />

            Y:
            <Input
                id="input-y-cord"
                value={action.y}
                onChange={(e) => change({...action, y: parseNum(e.target.value)})}
                pattern={"/^\d+$/"}
            />
          </div>

          <div className={styles.row}>
            Scroll:
            <Input
                id="input-scroll"
                value={action.wheel}
                onChange={(e) => change({...action, wheel: parseNum(e.target.value)})}
                pattern={"/^\d+$/"}

            />

            Pan:
            <Input
                id="input-pan"
                value={action.pan}
                onChange={(e) => change({...action, pan: parseNum(e.target.value)})}
                pattern={"/^\d+$/"}
            />
          </div>
        </div>
      </>
  );
}

export function parseNum(input: string): number {
  if (input.trim().length === 0) return 0;
  return parseInt(input, 10);
}