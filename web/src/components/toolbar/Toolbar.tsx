import {Download, Moon, Sun} from "lucide-react";
import styles from "@/components/toolbar/Toolbar.module.css";
import type {ReactNode} from "react";
import {useToolbar} from "@/components/toolbar/useToolbar.ts";
import {Spinner} from "@/shadcn/ui/spinner.tsx";
import {Toaster} from "sonner";
import {ToolbarItem} from "@/components/toolbar/ToolbarItem.tsx";
import {LangMenu} from "@/components/toolbar/LangMenu.tsx";

const baseUrl = import.meta.env.BASE_URL

export function Toolbar({children}: { children: ReactNode }) {
  const {theme, setTheme, isLoading, onLangChange, t} = useToolbar();

  if (isLoading) return (
    <div className="center">
      <Spinner className={"size-10"}/>
    </div>
  );

  return (<>
      <div className={styles.toolbar}>
        <LangMenu onLangChange={onLangChange}/>

        <ToolbarItem
          icon={<Download/>}
          tooltipContent={t("downloadFirmware")}
          onClick={() => window.open(baseUrl + "firmware.uf2")}
        />

        <ToolbarItem
          icon={theme == "dark" ? <Sun/> : <Moon/>}
          onClick={() => setTheme(
            theme == "dark"
              ? "light"
              : "dark"
          )}
        />
      </div>
      <main>
        {children}
      </main>
      <Toaster/>
    </>
  );
}