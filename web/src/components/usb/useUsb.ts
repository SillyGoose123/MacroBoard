import {useCallback, useEffect, useState} from "react";
import {usbPid, usbVid} from "@/../bindings//const.ts";
import {initDevice, sendCommand} from "@/components/usb/utils/commands.ts";
import type {Command} from "@/../bindings//Command.ts";
import type {Config} from "@/../bindings/Config";

const filters = [
  {vendorId: usbVid, productId: usbPid}
]
export const useUsb = () => {
  const [device, setDevice] = useState<null | USBDevice>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);

  const executeCommand = useCallback(async (command: Command, data: Uint8Array) => {
    setIsLoading(true);

    if (!device) {
      setError("Can't execute with no device!");
      setIsLoading(false);
      return;
    }

    await sendCommand(device, command, data)

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
      setConfig(await initDevice(value));
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
    if(device == null) return;
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

  return {
    check,
    isAvailable: device != null,
    isLoading,
    error,
    executeCommand,
    config
  }
}