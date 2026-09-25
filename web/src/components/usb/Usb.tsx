import {useUsb} from "@/components/usb/useUsb.ts";
import {Button} from "@/shadcn/components/ui/button.tsx";
import styles from "@/components/usb/Usb.module.css";
import {Backdrop} from "@/shadcn/components/ui/backdrop.tsx";
import {Spinner} from "@/shadcn/components/ui/spinner.tsx";
import {ConfigEditor} from "@/components/usb/ConfigEditor/ConfigEditor.tsx";

export function Usb() {
  const {
    error,
    isLoading,
    check,
    isAvailable,
    config,
    executeCommand,
    save,
    wasChanged,
    changeConfig,
    reload
  } = useUsb();

  return (<div className={styles.fullscreen}>
        {
          isAvailable && config != null && error == null
              ? <ConfigEditor
                  config={config}
                  executeCommand={executeCommand}
                  wasChanged={wasChanged}
                  changeConfig={changeConfig}
                  save={save}
                  reload={reload}
                  error={error}
              />
              : <CheckUsb check={check} error={error}/>
        }

        <Backdrop
            open={isLoading}
            onClose={() => {
            }}
        >
          <Spinner className={"size-10"}/>
        </Backdrop>
      </div>
  );
}

type CheckUsbProps = {
  check: () => Promise<void>;
  error: string | null;
}

function CheckUsb({check, error}: CheckUsbProps) {
  return <div className={styles.checkUsb}>
    {error == null
        ? "Press the button to connect!"
        : <span className={styles.error}>{error}</span>}
    <Button onClick={check}>Check for macro board</Button>
  </div>
}