import type {ConfigOptions} from "@/ui/usb/ConfigEditor/ConfigEditor.tsx";
import type {KnobAction} from "@/../bindings/KnobAction";
import {EditSwitch} from "@/ui/usb/ConfigEditor/ConfigDialog/edit-switch/EditSwitch.tsx";
import {Item} from "@/shadcn/ui/item.tsx";
import styles from "@/ui/usb/ConfigEditor/ConfigDialog/edit-knob/EditKnob.module.css"
import {ArrowBigDownDash, RotateCcw, RotateCw} from "lucide-react";
import {Command} from "../../../../../../bindings/Command.ts";

type EditKnobProps = {
  changeConfig: (config: ConfigOptions) => void,
  config: KnobAction,
  executeCommand: (command: Command, data: number[], silent: boolean) => Promise<void>
}

export function EditKnob({changeConfig, config, executeCommand}: EditKnobProps) {
  return <div className={styles.groups}>
    <div>
      <RotateCcw/>
      <Item variant={"outline"}>
        <EditSwitch
          changeConfig={changeConfig}
          config={config.rotaryAction.plus}
          executeCommand={executeCommand}
        />
      </Item>
    </div>

    <div>
      <RotateCw/>
      <Item variant={"outline"}>
        <EditSwitch
          changeConfig={changeConfig}
          config={config.rotaryAction.minus}
          executeCommand={executeCommand}/>
      </Item>
    </div>

    <div>
      <ArrowBigDownDash/>
      <Item variant={"outline"}>
        <EditSwitch
          changeConfig={changeConfig}
          config={config.switch}
          executeCommand={executeCommand}
        />
      </Item>
    </div>
  </div>
}