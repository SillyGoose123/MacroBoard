import {AudioLines} from "lucide-react";
import {Tone} from "@/../bindings/Tone";
import {Slider} from "@/shadcn/ui/slider.tsx";
import {Command} from "../../../../../../bindings/Command.ts";

type EditSummerActionProps = {
  action: number,
  change: (tone: number) => void,
  executeCommand: (command: Command, data: number[], silent: boolean) => Promise<void>
};

export function EditSummerAction({action, change, executeCommand}: EditSummerActionProps) {
  return (<>
    <AudioLines/>
    <Slider
        step={1}
        min={1}
        max={Object.keys(Tone).length}
        value={[action]}
        onClick={() => executeCommand(Command.summ, [action], true).then()}
        onValueChange={(value) => change(value[0])}
    />
  </>);
}