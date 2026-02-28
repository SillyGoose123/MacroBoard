import {Dialog, DialogTrigger, DialogContent, } from "@/shadcn/components/ui/dialog.tsx";
import {ConfigType} from "@/components/usb/ConfigEditor/ConfigDialog/ConfigType/ConfigType.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shadcn/components/ui/tooltip.tsx";
import type {ConfigOptions} from "@/components/Usb/ConfigEditor/ConfigEditor.tsx";

type ConfigProps = {
  type: ConfigType,
  config: ConfigOptions,
  changeConfig: (config: ConfigOptions) => void,
}

export function ConfigDialog({type, config, changeConfig}: ConfigProps) {
  if(type === ConfigType.MCU || type === ConfigType.Summer) return type;

  return <Dialog>
    <DialogTrigger>
      <Tooltip>
        <TooltipTrigger asChild>
          {type}
        </TooltipTrigger>
        <TooltipContent>
          Test
        </TooltipContent>
      </Tooltip>
    </DialogTrigger>
    <DialogContent>
     Test
    </DialogContent>
  </Dialog>
}