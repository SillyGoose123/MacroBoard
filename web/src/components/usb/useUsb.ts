import {useCallback, useEffect, useState} from "react";
import {usbPid, usbVid} from "@/../bindings//const.ts";
import {updateConfig, initDevice, sendCommand, readConfig} from "@/components/Usb/utils/commands.ts";
import type {Command} from "@/../bindings//Command.ts";
import type {Config} from "@/../bindings/Config";

const filters = [
  {vendorId: usbVid, productId: usbPid}
];

export function useUsb() {
  const [device, setDevice] = useState<null | USBDevice>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);
  const [wasChanged, setWasChanged] = useState<boolean>(false);

  const executeCommand = useCallback(async (command: Command, data: number[], silent: boolean) => {
    setIsLoading(!silent && true);

    if (!device) {
      setError("Can't execute with no device!");
      setIsLoading(false);
      return;
    }

    await sendCommand(device, command, Uint8Array.from(data))

    setIsLoading(false);
  }, [device])

  const check = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (device != null) {
      await device.close()
      setDevice(null);
    }

    if (navigator.usb == undefined) {
      setError("Browser incompatible")
      setIsLoading(false);
      return;
    }

    navigator.usb.requestDevice({filters}).then(async value => {
      setIsLoading(true);
      try {
        setConfig(await initDevice(value));
      } catch (error) {
        setError(error as string);
        setIsLoading(false);
        setDevice(null);
        return;
      }

      setDevice(value);
      setIsLoading(false);
    }).catch((err: Error) => {
      console.error(err);
      setError(err.message);
      setDevice(null);
      setIsLoading(false);
    });
  }, [device]);

  const close = useCallback(async () => {
    if (device == null) return;
    setIsLoading(true);
    await device.close();
    setDevice(null);
    setError(null);
    setIsLoading(false);
  }, [device])

  useEffect(() => {
    window.addEventListener("beforeunload", async () => {
      await close();
    })
  }, []);

  const changeConfig = (config: Config) => {
    setConfig({...config});
    setWasChanged(true)
  }

  const save = useCallback(async () => {
    setIsLoading(true)
    if (!device || !config || !wasChanged) {
      setError(!device
          ? "Can't execute with no device!"
          : !config
              ? "Cant update an non existing config!"
              : "Skipping save of unsaved config!"
      );
      setIsLoading(false);
      return;
    }

    try {
      await updateConfig(device, config);
    } catch (e) {
      setError(e as string);
    }


    setIsLoading(false)
  }, [config]);

  const reset = useCallback(async () => {
    setIsLoading(true);
    if (!device) {
      setError("Can't execute with no device!");
      setIsLoading(false);
      return;
    }

    try {
      let config = await readConfig(device);
      setConfig(config);
      setWasChanged(false);
    } catch (e) {
      setError(e as string);
    }

    setIsLoading(false);
  }, [device])

  return {
    check,
    isAvailable: device != null,
    isLoading,
    error,
    executeCommand,
    config,
    wasChanged,
    changeConfig,
    save,
    reset
  }
}