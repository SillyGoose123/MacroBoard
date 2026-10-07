import type {Flash} from "@bindings/Flash";
import type {EditComponentProps} from "@/components/usb/config/configLogic.ts";
import type {UsbHookProps} from "@/components/usb/config/useConfigEditor.ts";

export function EditFlashAction({change, part}: EditComponentProps<Flash> & Pick<UsbHookProps, "flash">) {
  return (<>
  </>);
}