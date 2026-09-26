import type {UsbHookProps} from "@/components/usb/config/ConfigEditor.tsx";
import type {useUsbReturnType} from "@/components/usb/useUsb.ts";
import {useState} from "react";

export type UsbHookProps = Pick<useUsbReturnType, "beep" | "flash" | "readConfig" | "sendConfig">;
export function useConfigEditor({}: UsbHookProps) {
  const [wasStored, setStored] = useState<boolean>(false);
  


}