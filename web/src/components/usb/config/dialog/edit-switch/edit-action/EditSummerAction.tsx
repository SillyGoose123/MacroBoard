import type {EditComponentProps} from "@/components/usb/config/configLogic.ts";
import {Tone} from "@bindings/Tone.ts";
import {Slider} from "@/shadcn/ui/slider.tsx";
import {AudioLines} from "lucide-react";
import type {UsbHookProps} from "@/components/usb/config/useConfigEditor.ts";

type EditSummerActionProps = EditComponentProps<Tone> & {
  beep: UsbHookProps["beep"]
}

export function EditSummerAction({change, part: tone, beep}: EditSummerActionProps) {
  return (<>
    <AudioLines/>
    <Slider
      step={1}
      min={1}
      max={Object.keys(Tone).length}
      value={[tone]}
      onClick={() => beep(tone)}
      onValueChange={(value) => change(value[0])}
    />
  </>);
}