import {type UsbHookProps, useConfigEditor} from "@/components/usb/config/useConfigEditor.ts";
import styles from "./ConfigEditor.module.css";
import {ConfigDialog} from "@/components/usb/config/dialog/ConfigDialog.tsx";
import {ConfigIcon} from "@/components/usb/config/dialog/config-icon/ConfigIcon.tsx";
import {multiple} from "@/utils.ts";
import {useTranslation} from "@/components/TranslationProvider.tsx";
import {manufacturer, product} from "@bindings/const.ts";
import {Tone} from "@bindings/Tone.ts";
import {ActionButton} from "@/components/usb/config/action-button/ActionButton.tsx";
import {RefreshCcw, Save, Trash} from "lucide-react";
import {Loader} from "@/components/Loader.tsx";

export function ConfigEditor(props: UsbHookProps) {
  const {t} = useTranslation();
  const {wasStored, isDefault, reload, reset, store, config, changeConfig} = useConfigEditor(props);

  if (config == null) return <Loader isLoading={config == null}/>;
  return (
    <div className={styles.configEditor}>

      <div className={styles.row}>
        <ConfigIcon type={"MCU"}/>
        <ConfigDialog
          type={"Knob"}
          config={config}
          changeConfig={changeConfig}
        />

        {multiple(2, (index) =>
          <ConfigDialog
            key={`switch-${index + 4}`}
            type={"Switch"}
            num={index + 5}
            config={config}
            changeConfig={changeConfig}
          />
        )}

        <ConfigIcon
          type={"Summer"}
          onClick={() => props.beep(Tone.default)}
        />
      </div>

      <div className={styles.row}>
        <ConfigDialog
          type={"LED"}
          config={config}
          changeConfig={changeConfig}
        />

        {multiple(4, (index) =>
          <ConfigDialog
            key={`switch-${index}`}
            type={"Switch"}
            num={index + 1}
            config={config}
            changeConfig={changeConfig}
          />
        )}

        <ConfigDialog
          type={"LED"}
          config={config}
          changeConfig={changeConfig}
        />
      </div>

      <div className={styles.row}>
        <ConfigDialog
          type={"LED"}
          config={config}
          changeConfig={changeConfig}
        />

        <span>{t("createdBy", {manufacturer})}</span>

        <ConfigDialog
          type={"LED"}
          config={config}
          changeConfig={changeConfig}
        />

        <span>{product}</span>

        <ConfigDialog
          type={"LED"}
          config={config}
          changeConfig={changeConfig}
        />
      </div>

      <div className={styles.row} style={{marginTop: "16px"}}>
        <ActionButton disabled={wasStored()} onClick={reload} icon={RefreshCcw}/>
        <ActionButton disabled={isDefault()} onClick={reset} icon={Trash}/>
        <ActionButton disabled={wasStored()} onClick={store} icon={Save}/>
      </div>
    </div>
  );
}