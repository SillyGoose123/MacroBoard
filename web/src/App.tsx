import {ThemeProvider} from "@/components/theme/ThemeProvider.tsx";
import {ThemeSwitcher} from "@/components/theme/ThemeSwitcher.tsx";
import {Usb} from "@/components/Usb/Usb.tsx";
import {TooltipProvider} from "@/shadcn/components/ui/tooltip.tsx";

export default function App() {
  return (
      <ThemeProvider storageKey="vite-ui-theme">
        <TooltipProvider>
          <ThemeSwitcher/>
          <Usb/>
        </TooltipProvider>
      </ThemeProvider>);
}
