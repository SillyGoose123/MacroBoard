import {ThemeProvider} from "@/components/theme/ThemeProvider.tsx";
import {ThemeSwitcher} from "@/components/theme/ThemeSwitcher.tsx";
import {Usb} from "@/components/usb/Usb.tsx";

export default function App() {
  return (
      <ThemeProvider storageKey="vite-ui-theme">
          <ThemeSwitcher />
          <Usb />
      </ThemeProvider>);
}
