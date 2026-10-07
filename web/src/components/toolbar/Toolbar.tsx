import {Download, Moon, Sun} from "lucide-react";
import styles from "@/components/toolbar/Toolbar.module.css";
import type {ReactNode} from "react";
import {useToolbar} from "@/components/toolbar/useToolbar.ts";
import {Toaster} from "sonner";
import {ToolbarItem} from "@/components/toolbar/ToolbarItem.tsx";
import {LangMenu} from "@/components/toolbar/LangMenu.tsx";
import {Loader} from "@/components/Loader.tsx";

const GITHUB_URL = "https://github.com/SillyGoose123/MacroBoard"

export function Toolbar({children}: { children: ReactNode }) {
  const {theme, setTheme, isLoading, onLangChange, download, t} = useToolbar();

  return (
    <>
      <div className={styles.toolbar}>
        <LangMenu onLangChange={onLangChange}/>

        <ToolbarItem
          icon={<Download/>}
          tooltipContent={t("downloadFirmware")}
          onClick={download}
        />

        <ToolbarItem
          icon={<img alt="GH" src="/icons/github.svg" />}
          tooltipContent={t("sourceCodeGithub")}
          onClick={() => window.open(GITHUB_URL)}
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
      <Loader isLoading={isLoading}/>
    </>
  );
}