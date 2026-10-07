import {useTranslation} from "@/components/TranslationProvider.tsx";
import {useCallback, useEffect, useState} from "react";
import {useTheme} from "@/components/ThemeProvider.tsx";
import {toast} from "sonner";
const downloadUrl = import.meta.env.BASE_URL + "/downloads/";

//TODO: evaluate loading is needed
export function useToolbar() {
  const {theme, setTheme} = useTheme();
  const [isLoading, setLoading] = useState<boolean>(false);
  const {load, lang, switchLang, t} = useTranslation();

  useEffect(() => {
    load()
      .then(() => setLoading(false))
      .catch(onError);
  }, []);

  const onLangChange = useCallback((lang: string) => {
    setLoading(true);
    switchLang(lang)
      .then(() => setLoading(false))
      .catch(onError);
  }, [lang]);

  const onError = (error: unknown) => {
    setLoading(false);
    toast.error(error instanceof Error ? error.message : String(error));
  }

  const download = () =>  {
    window.open(downloadUrl + "firmware.uf2");
    if(navigator.userAgent.includes("Linux")) {
      window.open(downloadUrl + "70-macro-board.rules");
    }
  };

  return {
    theme,
    setTheme,
    isLoading,
    onLangChange,
    download,
    t
  }
}