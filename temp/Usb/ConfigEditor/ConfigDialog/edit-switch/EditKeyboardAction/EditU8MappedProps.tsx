import {type ComponentType, useCallback, useMemo} from "react";
import styles
  from "@/ui/usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeyboardAction.module.css";
import {Toggle} from "@/shadcn/ui/toggle.tsx";

type EditU8MappedProps = {
  value: number,
  change: (num: number) => void,
  options: ComponentType<{ className?: string }>[],
}

export function EditU8Mapped({value, change, options}: EditU8MappedProps) {
  const bits = useMemo(() => toBits(value), [value]);
  const handleModifierChange = useCallback(
      (index: number, pressed: boolean) => {
        const mask = 1 << index;
        change(pressed ? (value | mask) : (value & ~mask));
      },
      [change, bits]
  );

  return (<div className={styles.row}>
        {options.map((Component, index) => {
          return <Toggle
              variant={"outline"}
              size={"sm"}
              key={`modifier-toggle-${index}`}
              aria-label={"Toggle modifier"}
              pressed={(value & (1 << index)) !== 0}
              onPressedChange={(on) => handleModifierChange(index, on)}
          >
            <Component className="group-data-[state=on]/toggle:fill-foreground"/>
          </Toggle>;
        })}
      </div>
  );
}


function toBits(num: number) {
  let bits = num.toString(2).split('').map(Number);
  return [
    ...[...Array(8 - bits.length)].map((_, _i) => 0),
    ...bits
  ];

}
