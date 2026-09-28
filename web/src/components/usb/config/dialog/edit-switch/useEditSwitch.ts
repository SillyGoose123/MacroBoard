import {useCallback} from "react";
import {Action} from "@bindings/Action.ts";
import type {EditComponentProps} from "@/components/usb/config/configLogic.ts";
import {Tone} from "@bindings/Tone.ts";

const typeData = {
  [Action.keyAction]: {modifier: 0, keycodes: [0, 0, 0, 0, 0, 0]},
  [Action.mouseAction]: {buttons: 0, pan: 0, wheel: 0, y: 0, x: 0},
  [Action.summerAction]: Tone.default,
  [Action.flash]: {}
}

export function useEditSwitch({part, change}: EditComponentProps<Action[]>) {
  const addAction = useCallback((type: number) => {
    const newConfig = [...part];
    newConfig.push({type, data: typeData[type]} as Action);
    change(newConfig);
  }, [part]);


  return {
    addAction
  }
}