import {useUsb} from "./useUsb.ts";
import {ConfigEditor} from "@/components/usb/config/ConfigEditor.tsx";
import {CheckButton} from "@/components/usb/checkbutton/CheckButton.tsx";
import {Loader} from "@/components/Loader.tsx";

export function Usb() {
  const {isLoading, deviceConnected, check, readConfig, sendConfig, beep, flash} = useUsb();

  return (
    <div className="center">
      <Loader isLoading={isLoading}/>
      {deviceConnected
        ? <ConfigEditor
          readConfig={readConfig}
          sendConfig={sendConfig}
          beep={beep}
          flash={flash}
        />
        : <CheckButton onClick={check}/>
      }
    </div>
  );
}