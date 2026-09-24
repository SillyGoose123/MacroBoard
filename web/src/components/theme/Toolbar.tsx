import {useTheme} from "@/components/theme/ThemeProvider.tsx";
import {Button} from "@/shadcn/components/ui/button.tsx";
import {Download, Moon, Sun} from "lucide-react";
import styles from "@/components/theme/ThemeSwitcher.module.css";

export const Toolbar = () => {
  const {theme, setTheme} = useTheme();
  return <div className={styles.toolbar}>
    <Button
      onClick={() => window.open("/firmware.uf2")}
      size="icon"
      aria-label="Submit"
      variant="ghost"
    >
      <Download />
    </Button>

    <Button
      onClick={() => setTheme(
        theme == "dark"
          ? "light"
          : "dark"
      )}
      size="icon"
      aria-label="Submit"
      variant="ghost">
      {theme == "dark" ? <Sun/> : <Moon/>}
    </Button>
  </div>;
}