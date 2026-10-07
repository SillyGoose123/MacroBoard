import {type ComponentType, useCallback} from "react";
import type {EditCompProps} from "@/components/usb/config/configLogic.ts";
import {Toggle} from "@/shadcn/ui/toggle.tsx";


type EditU8MappedProps = EditCompProps<number> & {
  options: ComponentType<{ className?: string }>[],
}
export function EditU8Mapped({change, part, options}: EditU8MappedProps) {
  const handleModifierChange = useCallback(
    (index: number, pressed: boolean) => {
      const mask = 1 << index;
      change(pressed ? (part | mask) : (part & ~mask));
    },
    [change]
  );

  return (<>
    <div className={"row"}>
      {options.map((Component, index) => {
        return <Toggle
          variant={"outline"}
          size={"sm"}
          key={`modifier-toggle-${index}`}
          aria-label={"Toggle modifier"}
          pressed={(part & (1 << index)) !== 0}
          onPressedChange={(on) => handleModifierChange(index, on)}
        >
          <Component className="group-data-[state=on]/toggle:fill-foreground"/>
        </Toggle>;
      })}
    </div>
  </>);
}