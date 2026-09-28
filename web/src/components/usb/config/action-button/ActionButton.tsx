import styles from "./ActionButton.module.css";
import {type LucideIcon} from "lucide-react";
import {Button} from "@/shadcn/ui/button.tsx";

type ActionButtonProps = {
  disabled: boolean,
  onClick: () => void;
  icon: LucideIcon;
}

export function ActionButton({disabled, onClick, icon: Icon}: ActionButtonProps) {
  return (
    <Button
      className={styles.action}
      disabled={disabled}
      onClick={onClick}
      variant={"outline"}
    >
      <Icon strokeWidth={1.75}/>
    </Button>
  );
}