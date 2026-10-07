import {useCallback, useEffect, useRef, useState} from "react";
import {filters, initDevice} from "@/components/usb/usb-logic/commands.ts";
import {
  beep as beepCmd,
  flash as flashCmd,
  readConfig as readConfigCmd,
  updateConfig
} from "@/components/usb/usb-logic/commands.ts";
import type {Tone} from "@bindings/Tone.ts";
import {handleCatch} from "@/utils.ts";
import {useTranslation} from "@/components/TranslationProvider.tsx";
import type {Flash} from "@bindings/Flash";
import type {Config} from "@bindings/Config";
import {usbPid, usbVid} from "@bindings/const.ts";

export type useUsbReturnType = {
  isLoading: boolean;
  deviceConnected: boolean;
  check: () => Promise<void>;
  beep: (tone: Tone) => void;
  flash: (flash: Flash) => void;
  readConfig: () => Promise<Config>;
  sendConfig: (config: Config) => Promise<boolean>;
};

export function useUsb(): useUsbReturnType {
  const {t} = useTranslation();
  const [device, setDevice] = useState<null | USBDevice>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const inFlight = useRef<Promise<Config> | null>(null);

  useEffect(() => {
    let ignore = false;
    if (!navigator.usb) return;
    navigator.usb.addEventListener("connect", async (event) => {
      if(!ignore
        || device != null
        || event.device.vendorId != usbVid
        || event.device.productId != usbPid
      ) return;
      setLoading(true);
      setDevice(await initDevice(event.device));
      setLoading(false);
    });

    navigator.usb.addEventListener("disconnect", (event) => {
      if(event.device.vendorId == usbVid
        && event.device.productId == usbPid
        && event.device.configuration?.interfaces?.at(3)?.claimed)
        setDevice(null);
    });
    return () => { ignore = true; };
  }, []);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      setDevice(await initDevice(await navigator.usb.requestDevice(filters)));
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

  const readConfig = useCallback((): Promise<Config> => {
    if (device == null) throw "No device!";
    if (inFlight.current) return inFlight.current; //prevent multiple accesses to device
    setLoading(true);
    const configPromise = readConfigCmd(device).finally(() => {
      inFlight.current = null;
      setLoading(false);
    });
    inFlight.current = configPromise;
    return configPromise;
  }, [device]);

  const sendConfig = useCallback(async (config: Config): Promise<boolean> => {
    if (device == null) throw "No device!";
    setLoading(true);
    try {
      let res = await updateConfig(device, config)
      if (!res) handleCatch(t("storeConfigFailed"));
      setLoading(false);
      return res;
    } catch (error: unknown) {
      handleCatch(error);
    }
    setLoading(false);
    return false;
  }, [device]);

  return {
    isLoading,
    deviceConnected: device != null,
    check,
    beep,
    flash,
    readConfig,
    sendConfig
  }
}
