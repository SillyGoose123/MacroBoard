import {useTheme} from "@/components/theme/ThemeProvider.tsx";
import {Button} from "@/shadcn/components/ui/button.tsx";
import {Moon, Sun} from "lucide-react";
import styles from "@/components/theme/ThemeSwitcher.module.css";

export const ThemeSwitcher = () => {
  const {theme, setTheme} = useTheme();
  return <div className={styles.toolbar}>
    <Button
        onClick={() => setTheme(
            theme == "dark"
                ? "light"
                : "dark"
        )}
        size="icon"
        aria-label="Submit"
        variant="ghost"
    >
      {theme == "dark" ? <Sun/> : <Moon/>}
    </Button>
  </div>;
}