import type {EditComponentProps} from "@/components/usb/config/configLogic.ts";
import styles from "./EditSwitch.module.css";
import { Button } from "@/shadcn/ui/button";
import {AudioLines, Keyboard, Mouse, Plus, Spotlight} from "lucide-react";
import {Action} from "@bindings/Action.ts";
import {useCallback} from "react";
import {Tone} from "@bindings/Tone.ts";

const typeData = {
  [Action.keyAction]: {modifier: 0, keycodes: [0, 0, 0, 0, 0, 0]},
  [Action.mouseAction]: {buttons: 0, pan: 0, wheel: 0, y: 0, x: 0},
  [Action.summerAction]: Tone.default,
  [Action.flash]: {}
}

export function EditSwitch({part, change}: EditComponentProps<Action[]>) {
  const addAction = useCallback((type: number) => {
    const newConfig = [...part];
    newConfig.push({type, data: typeData[type]} as Action);
    change(newConfig);
  }, [part]);


  return (
    <div className={styles.container}>
      <div className={styles.actionList}>

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