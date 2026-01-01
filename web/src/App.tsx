import {ThemeProvider} from "@/components/theme/ThemeProvider.tsx";
import {ThemeSwitcher} from "@/components/theme/ThemeSwitcher.tsx";

export default function App() {
  return (
      <ThemeProvider storageKey="vite-ui-theme">
          <ThemeSwitcher />


      </ThemeProvider>);
}
