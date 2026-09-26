import {type UsbHookProps, useConfigEditor} from "@/components/usb/config/useConfigEditor.ts";


export function ConfigEditor(props: UsbHookProps) {
  const {} = useConfigEditor(props);

  return (
    <div>
      EDITOR
    </div>
  );
}