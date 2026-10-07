import {Tone} from "@bindings/Tone.ts";
import {Slider} from "@/shadcn/ui/slider.tsx";
import {AudioLines} from "lucide-react";
import type {EditCompCommandProps} from "@/components/usb/config/configLogic.ts";

export function EditSummerAction({change, part: tone, beep}: Omit<EditCompCommandProps<Tone>, "flash">) {
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