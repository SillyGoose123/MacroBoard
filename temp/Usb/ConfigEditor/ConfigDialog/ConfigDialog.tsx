import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/shadcn/ui/dialog.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shadcn/ui/tooltip.tsx";
import type {ConfigOptions} from "@/ui/usb/ConfigEditor/ConfigEditor.tsx";
import {ConfigType} from "@/ui/usb/ConfigEditor/ConfigDialog/ConfigType/ConfigType.tsx";
import {EditLed} from "@/ui/usb/ConfigEditor/ConfigDialog/edit-led/EditLed.tsx";
import {EditKnob} from "@/ui/usb/ConfigEditor/ConfigDialog/edit-knob/EditKnob.tsx";
import {EditSwitch} from "@/ui/usb/ConfigEditor/ConfigDialog/edit-switch/EditSwitch.tsx";
import type {Effect} from "@/../bindings/Effect";
import type {Action} from "@/../bindings/Action.ts";
import type {KnobAction} from "@/../bindings/KnobAction";
import styles from "@/ui/usb/ConfigEditor/ConfigDialog/ConfigDialog.module.css";
import {Command} from "../../../../../bindings/Command.ts";

type ConfigProps = {
  type: ConfigType,
  config: ConfigOptions,
  changeConfig: (config: ConfigOptions) => void,
  KnobAction?: boolean,
  executeCommand: (command: Command, data: number[], silent: boolean) => Promise<void>,
}

export function ConfigDialog({type, config, changeConfig, executeCommand}: ConfigProps) {
  if (type === ConfigType.MCU || type === ConfigType.Summer) return type;

  const typeName = type == ConfigType.LED
    ? "LED"
    : type === ConfigType.Knob
      ? "Knob"
      : "Switch"
  ;

  return (<Dialog>
    <DialogTrigger>
      <Tooltip>
        <TooltipTrigger asChild>
          {type}
        </TooltipTrigger>
        <TooltipContent>
          {typeName}
        </TooltipContent>
      </Tooltip>
    </DialogTrigger>
    <DialogContent className={styles.dialogContent}>
      <DialogHeader>
        <DialogTitle>Edit {typeName} </DialogTitle>
        <DialogDescription hidden>
          This dialog contains elements for changing the {typeName} configuration.
        </DialogDescription>
      </DialogHeader>
      {typeName === "LED" && <EditLed changeConfig={changeConfig} config={config as Effect}/>}
      {typeName === "Knob" &&
        <EditKnob changeConfig={changeConfig} config={config as KnobAction} executeCommand={executeCommand}/>}
      {typeName === "Switch" &&
        <EditSwitch
          changeConfig={changeConfig}
          config={config as Action[]}
          executeCommand={executeCommand}
        />}
    </DialogContent>
  </Dialog>);
}

