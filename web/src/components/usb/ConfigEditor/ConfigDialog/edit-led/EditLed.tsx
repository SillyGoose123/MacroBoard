import type {ConfigOptions} from "@/components/Usb/ConfigEditor/ConfigEditor.tsx";
import type {Effect} from "@/../bindings/Effect";
import {Input} from "@/shadcn/components/ui/input.tsx";
import {RgbColorPicker, RgbStringColorPicker} from "react-colorful";
import type {RGB8} from "../../../../../../bindings/RGB8";

type EditLedProps = {
  changeConfig: (config: ConfigOptions) => void,
  config: Effect,
}

export function EditLed({config}: EditLedProps) {
  return <div>
    <div>

    </div>

    <Input />
  </div>
}

type EditColorProps = {
  config: RGB8
};

function EditColor({config}: EditColorProps) {
  return <div>

  </div>;
}