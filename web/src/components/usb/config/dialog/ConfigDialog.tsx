import {ConfigIcon, type ConfigIconTypes} from "@/components/usb/config/dialog/ConfigIcon.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/shadcn/ui/dialog.tsx";
import {useTranslation} from "@/components/TranslationProvider.tsx";
import type {ConfigOptions} from "@/components/usb/config/configLogic.ts";


type ConfigDialogProps = {
  type: ConfigIconTypes;
  index?: number;
  config: ConfigOptions;
  changeConfig: (config: ConfigOptions) => void
};

export function ConfigDialog({type, index}: ConfigDialogProps) {
  const {t} = useTranslation();
  const num = index ? (index + 1).toString() : null;
  return <Dialog>
    <DialogTrigger asChild>
      <div>
        <ConfigIcon type={type}/>
      </div>
    </DialogTrigger>
    <DialogContent>
      <DialogDescription hidden>
        {t("ConfigDialogDescription", {type})}
      </DialogDescription>
      <DialogHeader>
        <DialogTitle>{t("Edit", {type, num})}</DialogTitle>
      </DialogHeader>

    </DialogContent>
  </Dialog>
}