import {Backdrop} from "@/shadcn/ui/backdrop.tsx";
import {Spinner} from "@/shadcn/ui/spinner.tsx";
import {useUsb} from "./useUsb.ts";
import {ConfigEditor} from "@/components/usb/config/ConfigEditor.tsx";
import {CheckButton} from "@/components/usb/checkbutton/CheckButton.tsx";

export function Usb() {
  const {isLoading, deviceConnected, check} = useUsb();

  return (
    <div className="center">
      <Backdrop
        open={isLoading}
        onClose={() => {
        }}
      >
        <Spinner className={"size-10"}/>
      </Backdrop>
      {deviceConnected
        ? <ConfigEditor/>
        : <CheckButton onClick={check}/>
      }
    </div>
  );
}