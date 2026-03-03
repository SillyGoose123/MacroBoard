import type {ConfigOptions} from "@/components/Usb/ConfigEditor/ConfigEditor.tsx";
import type {KnobAction} from "@/../bindings/KnobAction";
import {EditSwitch} from "@/components/Usb/ConfigEditor/ConfigDialog/edit-switch/EditSwitch.tsx";
import {Item} from "@/shadcn/components/ui/item.tsx";
import styles from "@/components/Usb/ConfigEditor/ConfigDialog/edit-knob/EditKnob.module.css"
import {ArrowBigDownDash, RotateCcw, RotateCw} from "lucide-react";

type EditKnobProps = {
  changeConfig: (config: ConfigOptions) => void,
  config: KnobAction,
}

export function EditKnob({changeConfig, config}: EditKnobProps) {
  return <div className={styles.groups}>
    <div>
      <RotateCcw/>
      <Item variant={"outline"}>
        <EditSwitch changeConfig={changeConfig} config={config.rotaryAction.plus}/>
      </Item>
    </div>

    <div>
      <RotateCw/>
      <Item variant={"outline"}>
        <EditSwitch changeConfig={changeConfig} config={config.rotaryAction.minus}/>
      </Item>
    </div>

    <div>
      <ArrowBigDownDash/>
      <Item variant={"outline"}>
        <EditSwitch changeConfig={changeConfig} config={config.switch}/>
      </Item>
    </div>
  </div>
}