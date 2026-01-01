import {useTheme} from "@/components/theme/ThemeProvider.tsx";
import {Button} from "@/shadcn/components/ui/button.tsx";
import {Moon, Sun} from "lucide-react";

export const ThemeSwitcher = () => {
    const {theme, setTheme} = useTheme();
    return <>
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
    </>;
}