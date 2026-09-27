import {type UsbHookProps, useConfigEditor} from "@/components/usb/config/useConfigEditor.ts";
import styles from "./ConfigEditor.module.css";
import {ConfigDialog} from "@/components/usb/config/dialog/ConfigDialog.tsx";
import {ConfigIcon} from "@/components/usb/config/dialog/ConfigIcon.tsx";
import {multiple} from "@/utils.ts";
import {useTranslation} from "@/components/TranslationProvider.tsx";
import {manufacturer, product} from "../../../../bindings/const.ts";
import {Tone} from "../../../../bindings/Tone.ts";
import {ActionButton} from "@/components/usb/config/actionbutton/ActionButton.tsx";
import {RefreshCcw, Save, Trash} from "lucide-react";

export function ConfigEditor(props: UsbHookProps) {
  const {t} = useTranslation();
  const {wasStored, isDefault, reload, reset, store} = useConfigEditor(props);

  return (
    <div className={styles.configEditor}>

      <div className={styles.row}>
        <ConfigIcon type={"MCU"}/>
        <ConfigDialog type={"Knob"}/>

        {multiple(2, (index) =>
          <ConfigDialog
            key={`switch-${index + 4}`}
            type={"Switch"}
            index={index + 4}
          />
        )}

        <ConfigIcon type={"Summer"} onClick={() => props.beep(Tone.default)}/>
      </div>

      <div className={styles.row}>
        <ConfigDialog type={"LED"}/>

        {multiple(4, (index) =>
          <ConfigDialog
            key={`switch-${index}`}
            type={"Switch"}
            index={index}
          />
        )}

        <ConfigDialog type={"LED"}/>
      </div>

      <div className={styles.row}>
        <ConfigDialog type={"LED"}/>

        <span>{t("createdBy", {manufacturer})}</span>

        <ConfigDialog type={"LED"}/>

        <span>{product}</span>

        <ConfigDialog type={"LED"}/>
      </div>

      <div className={styles.row}>
        <ActionButton disabled={wasStored()} onClick={reload} icon={RefreshCcw}/>
        <ActionButton disabled={isDefault()} onClick={reset} icon={Trash}/>
        <ActionButton disabled={wasStored()} onClick={store} icon={Save}/>
      </div>
    </div>
  );
}