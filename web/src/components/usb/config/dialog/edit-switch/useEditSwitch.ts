import type { EditCompProps } from "@/components/usb/config/configLogic.ts";
import { Action } from "@bindings/Action.ts";
import { Tone } from "@bindings/Tone.ts";

const typeData = {
  [Action.keyAction]: { modifier: 0, keycodes: [0, 0, 0, 0, 0, 0] },
  [Action.mouseAction]: { buttons: 0, pan: 0, wheel: 0, y: 0, x: 0 },
  [Action.summerAction]: Tone.default,
  [Action.flash]: {},
};

export function useEditSwitch({ part, change }: EditCompProps<Action[]>) {
  const addAction = (type: number) => {
    change([...part, { type, data: typeData[type] } as Action]);
  };

  const changeAction = (action: Action, index: number) => {
    const newPart = [...part];
    newPart[index] = action;
    change(newPart);
  };

  return {
    addAction,
    changeAction,
  };
}
