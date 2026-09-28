import {createContext, type ReactNode, useCallback, useContext, useState} from "react";

const locales: Record<string, () => Promise<unknown>> = import.meta.glob("../../public/locales/*.json5");

type TranslationProviderProps = {
  children: ReactNode;
  defaultLang?: string;
  storageKey?: string;
};

type LocaleMap = Record<string, string | undefined | null>;

type TranslationProviderState = {
  lang: string;
  locales: Array<string>;
  t: (key: string, params?: LocaleMap) => string;
  switchLang: (lang: string) => Promise<void>;
  load: () => Promise<void>;
}


const initialState: TranslationProviderState = {
  lang: "en",
  locales: ["en"],
  t: (_key: string, _params?: LocaleMap) => "?",
  switchLang: async (_lang: string) => {
  },
  load: async () => {
  }
}
const TranslationProviderContext = createContext<TranslationProviderState>(initialState);

export function TranslationProvider({
                                      children,
                                      defaultLang = "en",
                                      storageKey = "lang",
                                      ...props
                                    }: TranslationProviderProps) {
  const [lang, setLang] = useState<string>(
    () => localStorage.getItem(storageKey) || defaultLang
  );

  const [file, setFile] = useState<null | LocaleMap>(null)

  const t = useCallback((key: string, params?: LocaleMap): string => {
    if (lang == null || file == null) return "?";
    return parseResource(key, file, params);
  }, [lang, file]);

  const switchLang = async (locale: string) => {
    if (locale == lang) return;
    setFile(await readLocale(locale));
    localStorage.setItem(storageKey, locale);
    setLang(locale);
  };

  const load = async () => {
    setFile(await readLocale(lang));
  };

  const value: TranslationProviderState = {
    lang,
    locales: formatLocales(),
    t,
    switchLang,
    load
  }

  return (
    <TranslationProviderContext.Provider {...props} value={value}>
      {children}
    </TranslationProviderContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider!")

  return context
}

function formatLocales(): Array<string> {
  let key = Object.keys(locales);
  const regex = /[^\/]*(?=.json5)/;
  return key
    .map((path) => (path.match(regex) ?? [""])[0])
    .filter(item => item !== "");
}


async function readLocale(lang: string): Promise<LocaleMap> {
  let res = await fetch(`/locales/${lang}.json5`);
  if (!res.ok) throw "Language not found!";
  return await res.json();
}
function parseResource(key: string | null, file: LocaleMap, params?: LocaleMap): string {
  if (!key) return "";

  const text = file[key] ?? "?";
  if (!params) return text;

  return replaceParams(replaceNestedResources(text, file, params), params);
}

const NESTED_REF_REGEX = /{{([^{}]+)}}/g;
function replaceNestedResources(text: string, file: LocaleMap, params: LocaleMap): string {
  return text.replace(
    NESTED_REF_REGEX,
    (_match, refKey: string) => parseResource(params[refKey] ?? null, file, params)
  );
}

const PARAM_REGEX = /{([^{}]+)}/g;
function replaceParams(text: string, params: LocaleMap): string {
  return text.replace(
    PARAM_REGEX,
    (_match, paramKey: string) => params[paramKey] ?? ""
  );
}