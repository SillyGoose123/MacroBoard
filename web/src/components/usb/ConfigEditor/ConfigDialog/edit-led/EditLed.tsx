import type {ConfigOptions} from "@/components/usb/ConfigEditor/ConfigEditor.tsx";
import type {Effect} from "@/../bindings/Effect";
import {Input} from "@/shadcn/components/ui/input.tsx";
import type {RGB8} from "../../../../../../bindings/RGB8";

type EditLedProps = {
  changeConfig: (config: ConfigOptions) => void,
  config: Effect,
}

export function EditLed({config}: EditLedProps) {
  return <div>
    <div>
      {
        config.colors.map((color) => <EditColor config={color}/>)
      }

    </div>

    <Input/>
  </div>
}

type EditColorProps = {
  config: RGB8
};

function EditColor({}: EditColorProps) {
  return <div>

  </div>;
}