import {ConfigIcon, type ConfigIconTypes} from "@/components/usb/config/dialog/config-icon/ConfigIcon.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/shadcn/ui/dialog.tsx";
import {useTranslation} from "@/components/TranslationProvider.tsx";
import type {Config} from "@bindings/Config";
import {EditLed} from "@/components/usb/config/dialog/edit-led/EditLed.tsx";
import {changePart, type ConfigOptions} from "@/components/usb/config/configLogic.ts";
import {EditKnob} from "@/components/usb/config/dialog/edit-knob/EditKnob.tsx";
import {EditSwitch} from "@/components/usb/config/dialog/edit-switch/EditSwitch.tsx";
import styles from "./ConfigDialog.module.css";


type ConfigDialogProps = {
  type: ConfigIconTypes;
  num?: number;
  config: Config;
  changeConfig: (config: Config) => void
};

export function ConfigDialog({type, num, config, changeConfig}: ConfigDialogProps) {
  const {t} = useTranslation();
  const change = (part: ConfigOptions) => changeConfig(changePart(config, part, num));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <ConfigIcon type={type} num={num}/>
        </div>
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogDescription hidden>
          {t("ConfigDialogDescription", {type})}
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>{t("Edit", {type, num: num ? " " + num : ""})}</DialogTitle>
        </DialogHeader>
        {type == "LED" && <EditLed part={config.effect} change={change}/>}
        {type == "Knob" && <EditKnob part={config.knobAction} change={change}/>}
        {type == "Switch" && num && <EditSwitch part={config.switchAction[num - 1]} change={change}/>}
      </DialogContent>
    </Dialog>
  );
}