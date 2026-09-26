import {useCallback, useState} from "react";
import {initDevice} from "@/components/usb/usb-logic/commands.ts";
import {
  beep as beepCmd,
  flash as flashCmd,
  readConfig as readConfigCmd,
  updateConfig
} from "@/components/usb/usb-logic/commands.ts";
import type {Tone} from "../../../bindings/Tone.ts";
import {handleCatch} from "@/utils.ts";
import {useTranslation} from "@/components/TranslationProvider.tsx";
import type {Flash} from "../../../bindings/Flash";
import type {Config} from "../../../bindings/Config";

export type useUsbReturnType = {
  isLoading: boolean;
  deviceConnected: boolean;
  check: () => Promise<void>;
  beep: (tone: Tone) => void;
  flash: (flash: Flash) => void;
  readConfig: () => Promise<Config>;
  sendConfig: (config: Config) => Promise<void>;
};

export function useUsb(): useUsbReturnType {
  const {t} = useTranslation();
  const [device, setDevice] = useState<null | USBDevice>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      setDevice(await initDevice());
    } catch (error: unknown) {
      handleCatch(error);
    }
    setLoading(false);
  }, []);

  const beep = useCallback((tone: Tone) => {
    if (device == null) throw "No device!";
    beepCmd(device, tone).catch(handleCatch).then((value) => {
      if (value) return;
      handleCatch(t("unableToBeep"))
    });
  }, [device]);

  const flash = useCallback((flash: Flash) => {
    if (device == null) throw "No device!";
    flashCmd(device, flash).catch(handleCatch).then((value) => {
      if (value) return;
      handleCatch(t("unableToFlash"))
    });
  }, [device]);

  const readConfig = useCallback(async () => {
    if (device == null) throw "No device!";
    setLoading(true);
    let config = await readConfigCmd(device);
    setLoading(false);
    return config;
  }, [device]);

  const sendConfig = useCallback(async (config: Config) => {
    if (device == null) throw "No device!";
    setLoading(true);
    try {
      if (!await updateConfig(device, config)) handleCatch(t("storeConfigFailed"));
    } catch (error: unknown) {
      handleCatch(error);
    }
    setLoading(false);
  }, [device]);

  return {
    isLoading,
    deviceConnected: device == null,
    check,
    beep,
    flash,
    readConfig,
    sendConfig
  }
}
