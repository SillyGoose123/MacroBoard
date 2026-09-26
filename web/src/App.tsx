import {Toolbar} from "@/components/toolbar/Toolbar.tsx";
import {Usb} from "@/components/usb/Usb.tsx";
import {ThemeProvider} from "@/components/ThemeProvider.tsx";
import {TranslationProvider} from "@/components/TranslationProvider.tsx";
import {TooltipProvider} from "@/shadcn/ui/tooltip.tsx";

export default function App() {
  return (
    <ThemeProvider storageKey="theme">
      <TranslationProvider storageKey="lang">
        <TooltipProvider>
          <Toolbar>
            <Usb/>
          </Toolbar>
        </TooltipProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}
