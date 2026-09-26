import {useTranslation} from "@/components/TranslationProvider.tsx";
import styles from "./CheckButton.module.css";
import {Button} from "@/shadcn/ui/button.tsx";

export function CheckButton({onClick}: {onClick: () => void}) {
  const {t} = useTranslation();

  if (navigator.usb == null) return <span>{t("browserIncompatible")}</span>;
  return (
    <Button onClick={onClick} className={styles.largeButton}>
      {t("checkForBoard")}
    </Button>
  );
}