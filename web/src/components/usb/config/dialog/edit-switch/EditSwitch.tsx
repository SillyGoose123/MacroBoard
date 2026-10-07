import {type EditComponentProps} from "@/components/usb/config/configLogic.ts";
import styles from "./EditSwitch.module.css";
import {Button} from "@/shadcn/ui/button";
import {AudioLines, Keyboard, Mouse, Plus, Spotlight} from "lucide-react";
import {Action} from "@bindings/Action.ts";
import {EditAction} from "@/components/usb/config/dialog/edit-switch/edit-action/EditAction.tsx";
import {useEditSwitch} from "@/components/usb/config/dialog/edit-switch/useEditSwitch.ts";
import type {UsbHookProps} from "@/components/usb/config/useConfigEditor.ts";

export function EditSwitch({part, change, beep, flash}: EditComponentProps<Action[]> & Pick<UsbHookProps, "beep" | "flash">) {
  const {changeAction, addAction} = useEditSwitch({part, change});
  return (
    <div className={styles.container}>
      <div className={styles.actionList}>
        {part.map((action: Action, index) =>
          <EditAction
            part={action}
            change={(action) => changeAction(action, index)}
            beep={beep}
            flash={flash}
          />
        )}
      </div>

      <div className={styles.row} style={{marginTop: "16px"}}>
        <Button variant={"outline"} onClick={() => addAction(Action.mouseAction)}>
          <Mouse/>
          <Plus/>
        </Button>

        <Button variant={"outline"} onClick={() => addAction(Action.keyAction)}>
          <Keyboard/>
          <Plus/>
        </Button>

        <Button variant={"outline"} onClick={() => addAction(Action.summerAction)}>
          <AudioLines/>
          <Plus/>
        </Button>

        <Button variant={"outline"} onClick={() => addAction(Action.flash)}>
          <Spotlight/>
          <Plus/>
        </Button>
      </div>
    </div>
  );
}