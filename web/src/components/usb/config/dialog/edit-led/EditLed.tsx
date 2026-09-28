import {Button} from "@/shadcn/ui/button.tsx";
import type {EditComponentProps} from "@/components/usb/config/configLogic.ts";
import type {Effect} from "@bindings/Effect";

export function EditLed({part, change}: EditComponentProps<Effect>) {
  return <>
    {JSON.stringify(part)}
    <Button onClick={() => change({
      timeDiff: 60,
      colors: [{r: 255, g: 0, b: 0}, {r: 0, g: 0, b: 255}]
    })}>Test</Button>
  </>
}