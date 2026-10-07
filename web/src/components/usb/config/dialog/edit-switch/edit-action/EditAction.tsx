import {Item} from "@/shadcn/ui/item.tsx";
import {type Action, Action as ActionEnum} from "@bindings/Action.ts";
import {EditKeyAction} from "@/components/usb/config/dialog/edit-switch/edit-action/EditKeyAction.tsx";
import {EditMouseAction} from "@/components/usb/config/dialog/edit-switch/edit-action/EditMouseAction.tsx";
import {EditSummerAction} from "@/components/usb/config/dialog/edit-switch/edit-action/EditSummerAction.tsx";
import {useCallback} from "react";
import type {SlimKeyReport} from "@bindings/SlimKeyReport";
import type {MouseReport} from "@bindings/MouseReport";
import type {EditComponentProps} from "@/components/usb/config/configLogic.ts";
import type {Tone} from "@bindings/Tone.ts";
import type {UsbHookProps} from "@/components/usb/config/useConfigEditor.ts";

export function EditAction({part: {type, data}, change, beep}: EditComponentProps<Action> & Pick<UsbHookProps, "beep" | "flash">) {
  const changeData = useCallback((data: Action["data"]) => {
    change({type: type, data} as Action);
  }, [type, change]);

  return (
    <Item variant="muted">
      {type == ActionEnum.keyAction && <EditKeyAction part={data as SlimKeyReport} change={changeData}/>}
      {type == ActionEnum.mouseAction && <EditMouseAction part={data as MouseReport} change={changeData}/>}
      {type == ActionEnum.summerAction && <EditSummerAction part={data as Tone} change={changeData} beep={beep}/>}
      {type == ActionEnum.flash && <EditMouseAction part={data as MouseReport} change={changeData} />}
    </Item>
  );
}