import type {useUsbReturnType} from "@/components/usb/useUsb.ts";
import {useCallback, useEffect, useState} from "react";
import type {Config} from "@bindings/Config";
import {DEFAULT_CONFIG, isDefaultConfig, jsonEqual} from "@/components/usb/config/configLogic.ts";
import {handleCatch} from "@/utils.ts";

export type UsbHookProps = Pick<useUsbReturnType, "beep" | "flash" | "readConfig" | "sendConfig">;

export function useConfigEditor({readConfig, sendConfig}: UsbHookProps) {
  const [loaded, setLoaded] = useState<Config | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    readConfig()
      .then((val) => {
        setLoaded(val);
        setConfig(val);
      })
      .catch(handleCatch);
  }, []);

  const wasStored = () => jsonEqual(loaded, config);
  const isDefault = () => isDefaultConfig(config);
  const reset = () => setConfig(DEFAULT_CONFIG);

  const reload = useCallback(() => {
    if(!loaded) return;
    setConfig(loaded);
  }, [loaded]);

  const store = useCallback(async () => {
    if(!config) return;
    let wasStored = await sendConfig(config);
    if(wasStored) setLoaded(config) ;
    return wasStored;
  }, [config]);

  const changeConfig = useCallback((newConfig: Config) => {
    if(config != null && jsonEqual(newConfig, config)) return;
    setConfig({...newConfig});
  }, [config]);

  return {
    config,
    wasStored,
    isDefault,
    reset,
    reload,
    store,
    changeConfig
  };
}